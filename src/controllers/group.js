const { GroupModel } = require('../models/group');
const { ChatModel } = require('../models/chat');
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
	},{_id: 1, name: 1, image: 1, subtitle:1}).then(doc =>{
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
	await addUser(groupExists.chat, req.body.userId);
	GroupModel.update(
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
async function addUser(chatId, userId){
	return ChatModel.update(
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
