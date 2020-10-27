var fs = require('fs');

const { GroupModel, PostModel, ResourceModel, CommentModel } = require('../models/group');
const { ChatModel } = require('../models/chat');
//const { PostModel } = require('../models/group');
//const { ChatModel } = require('../models/chat');
const { groupValidation } = require('../config/schemas')


module.exports.getGroup = (req, res) => {
  if(!req.body.name){
    return res.status(400).send('missing url parameter: name')
  }
  GroupModel.findOne({
    name: req.body.name
  }).then(doc =>{
    res.json(doc)
  }).catch(err =>{
    res.status(500).json(err)
  })
}

module.exports.getAllGroups = (req, res) => {
  GroupModel.find({})
  .then(doc =>{
    res.json(doc)
  }).catch(err =>{
    res.status(500).json(err)
  })
}

module.exports.getProject = (req, res) => {
  if(!req.body.name){
    return res.status(400).send('missing url parameter: name')
  }
  GroupModel.findOne({
    name: req.body.name,
    type: 'project'
  }).then(doc =>{
    res.json(doc)
  }).catch(err =>{
    res.status(500).json(err)
  })
}
module.exports.getMyGroups = (req, res) => {
	let userId = req.user._id;
	GroupModel.find({
	  members : userId
	},{_id: 1, name: 1, image: 1, subtitle:1, description:1, members:1, owner:1, posts:1, resources:1 })
		.populate('members','name image descripcio')
		.populate('resources.creator','name username image')
		.populate('posts.creator','name username image')
		.populate('posts.comments.creator','name username image')
	.then(doc =>{
	  res.json(doc)
	}).catch(err =>{
	  res.status(500).json(err)
	})
}
//TODO veure que torna dels usuaris
module.exports.getMyGroupMembers = (req, res) => {
	let userId = req.user._id;
	GroupModel.find({
	  members: userId,
	  name: req.body.name
	},{_id:0, members:1}).populate('members','name username').then(doc =>{
	  res.json(doc)
	}).catch(err =>{
	  res.status(500).json(err)
	})
}

module.exports.exploreProjects = (req, res) => {
	GroupModel.find({
	  type: 'project',
	  open: true
	},{_id: 1, name: 1, city:1, province:1,location:1, description:1,state:1,numMembers:1, totalMembers:1, image: 1}).then(doc =>{
	  res.json(doc)
	}).catch(err =>{
	  res.status(500).json(err)
	})
}

module.exports.exploreGroups = (req, res) => {
	GroupModel.find({
	},{_id: 1, name: 1, city:1, province:1,location:1, description:1,state:1,numMembers:1, totalMembers:1, image: 1}).then(doc =>{
	  res.json(doc)
	}).catch(err =>{
	  res.status(500).json(err)
	})
}

module.exports.createGroup = async (req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing')
	}
	//const { error } = groupValidation(req.body)
  	//if(error) return res.status(400).send(error.details[0].message)
  	let group = new GroupModel(req.body);
  	group.members = req.user._id;
  	

  	const nameExists = await GroupModel.findOne({ name: req.body.name})
	if(nameExists) return res.status(400).send('Name of the group already exists')

	//Creem el chat i pillem la id
	let chat = await createChat(group)
	if(chat) group.chat = chat

  	group.save().then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
		
	}).catch(err => {
		res.status(500).json(err)
	})
}


module.exports.addUser = async(req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}

	const groupExists = await GroupModel.findOne({ _id: req.body.groupId});
	if(!groupExists) return res.status(400).send('Group doesnt exists')
	await addUserFunction(groupExists.chat, req.body.userId);
	GroupModel.updateOne(
			{ _id: req.body.groupId}, 
			{ $push: { members : req.body.userId } }).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
		
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}
module.exports.joinGroup = async(req, res) => {
	console.log("userId", req.user._id)
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	console.log("userId", req.user._id)
	console.log("groupId", req.body.groupId)
	const groupExists = await GroupModel.findOne({ _id: req.body.groupId});
	if(!groupExists) return res.status(400).send('Group doesnt exists')
	await addUserFunction(groupExists.chat, req.user._id);
	GroupModel.updateOne(
			{ _id: req.body.groupId}, 
			{ $push: { members : req.user._id } }).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
		
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}
//Afegeix un post al grup
module.exports.addPost = async(req, res) => {

	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	let post = new PostModel(req.body);
	post.creator = req.user._id;
	post.likes = 0;
	GroupModel.updateOne(
			{ _id: req.body.groupId}, 
			{ $push: { posts : post } }).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}

//Afegeix un comentari al post
module.exports.addPostComment = async(req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	let comment = new CommentModel(req.body.comment);
	comment.creator = req.user._id;
	GroupModel.findOneAndUpdate(
		{ _id : req.body.groupId},
		{ $push: { 'posts.$[outer].comments' : comment } },
		{ "arrayFilters": [{"outer._id": req.body.postId}]}
	).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}

module.exports.addPostLike = async(req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	GroupModel.findOneAndUpdate(
		{ _id : req.body.groupId },
		{ $push: { 'posts.$[outer].likes' : req.user._id } },
		{ "arrayFilters": [{"outer._id": req.body.postId}]}
	).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}

//Afegeix un recurs al grup
module.exports.addResource = async(req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	let resource = new ResourceModel(req.body);
	resource.creator = req.user._id;
	GroupModel.updateOne(
			{ _id: req.body.groupId}, 
			{ $push: { resources : resource } }).then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		//return res.status(201).json({error:false, doc});
	}).catch(err => {
		res.status(500).json(err)
	});
	//GroupModel.addUser(userId, {name, description})
}
//de moment es fa servir sol en crear group
async function createChat(info){
	if(!info.name || !info.members) return;
	let chatInfo = { name : info.name , members : info.members};
	if(info.image) chatInfo.chatIcon = info.image;
	
	let chat = new ChatModel(chatInfo)
	return chat.save().then(doc => {
		if(!doc || doc.length === 0){
			console.log("Error no s'ha pogut crear el chat, resposta buida")
			return false
		}
		return doc._id;
		
	}).catch(err => {
		console.log("Error no s'ha pogut crear el chat", err)
		return;
	})
}

//de moment es fa servir sol en addUser
//Afegeix un usuari al array de membres de un chat
async function addUserFunction(chatId, userId){
	return ChatModel.updateOne(
			{ _id: chatId}, 
			{ $push: { members : userId } }).then(doc => {
		if(!doc || doc.length === 0){
			console.log("Error no s'ha pogut afegir a "+userId+" al chat, resposta buida")
			return false
		}
		return doc;
		
	}).catch(err => {
		console.log("Error no s'ha pogut afegir a "+userId+" al chat,", err)
		return;
	});
}

module.exports.saveFile = async(req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	console.log("data", req.body)
	//return res.status(200).send('Ok FALSO')
	let image = req.body.data;

	const imageExtension = checkFormatAndGetExtension(req.body.type)
	var imageBuffer = Buffer.from(req.body.data, 'base64');
	fs.writeFile('imatgeTest' + imageExtension, imageBuffer ,function (err) {
		if (err){
			console.log("error guardar imatge", err); 
			res.status(500).json(err)
		} 
		else {
			console.log('Saved!');
			res.status(200).send('Ok')
		}
	});
}

//comproba el format i retorna la extensio de la imatge
function checkFormatAndGetExtension(type){
	const allowed = new Array('image/jpeg', 'image/jpg', 'image/png');
	try {
		if (allowed.includes(type)){
		    return "."+type.substring(6,10)
		}
	}
	catch(err){
		console.log("Bad image extension", err); 
		throw new Error('Bad image extension');
	}
	
}
//decode de la imatge
function decodeImage(image){
	return new Buffer(data, 'base64');
}
