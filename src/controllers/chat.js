const { ChatModel } = require('../models/chat');


module.exports.getChatMessages = (req, res) => {
	let userId = req.user._id;
	ChatModel.findOne({
		_id: req.header('id'),
		members: userId
	}).then(doc =>{
		res.json(doc)
	}).catch(err =>{
		res.stats(500).json(err)
	})
}


module.exports.getMyChats = (req, res) => {
		let userId = req.user._id;
		ChatModel.find({
			members : userId
		},{_id: 1, name: 1, chatIcon: 1, members:1, chatType:1 , latestMessage:1}).populate('members', 'username name socketID image')
		.then(doc =>{
			res.header('id', userId).json(doc)
		}).catch(err =>{
			res.status(500).json(err)
		})
}


module.exports.createGroup = async (req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing')
	}
	const { error } = groupValidation(req.body)
 	if(error) return res.status(400).send(error.details[0].message)
 	let group = new GroupModel(req.body);
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

module.exports.addUser = async (req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing');
	}
	if(!req.query.group){
		return res.status(400).send('missing url parameter: group');
	}
	console.log(req.body.id);
	console.log(req.query.group);

	const groupExists = await GroupModel.findOne({ _id: req.query.group});
	if(!groupExists) return res.status(400).send('Group doesnt exists')

	GroupModel.update(
	{ _id: req.query.group}, 
	{ $push: { members : req.body.id } })
	.then(async doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);
		const nameExists = await GroupModel.findOne({ name: req.body.name})
		if(nameExists) return res.status(400).send('Name of the group already exists')
	}).catch(err => {
		res.status(500).json(err)
	});
}
