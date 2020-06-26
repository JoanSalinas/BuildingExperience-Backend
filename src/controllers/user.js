//external
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//internal
const { UserModel }  = require('../models/user')
const { registerValidation, loginValidation } = require('../config/schemas')
require('dotenv').config()





module.exports.authenticate = function authenticate({ username, password }) {
  const user = User.findOne({ 
	username 
  }).then( doc => {
	if (user && bcrypt.compareSync(password, user.hash)) {
		const { hash, ...userWithoutHash } = user.toObject();
		//const token = jwt.sign({ sub: user.id }, config.secret); 
		const token = jwt.sign({ sub: user.id }, process.env.TOKEN_SECRET); 
		return {
			...userWithoutHash,
			token
		};
	}
  }).catch(err =>{
	res.stats(500).json(err)
  })
}
/*
async function getAll() {
	return await User.find().select('-hash');
}

async function getById(id) {
	return await User.findById(id).select('-hash');
}*/

// req.body  Post Register
module.exports.createUser = async (req, res) => {
	if(!req.body){
		return res.status(400).send('Request body is missing')
	}

	// let user = {
  //   name: 'firstname lastname',
  //   email: 'email@gmail.com'
  // } =>
	//let model = new UserModel(req.body)

  //Validar
  const { error } = registerValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  //comprobar si existeix el correu
  const emailExists = await UserModel.findOne({ email: req.body.email})
  const usernameExists = await UserModel.findOne({ username: req.body.username})
  if(emailExists && usernameExists) return res.status(400).send('Email  and Username already exists')
  else if(emailExists) return res.status(400).send('Email already exists')
  else if(usernameExists) return res.status(400).send('Username already exists')

  //hash de la password
  const salt = await bcrypt.genSalt(10)
  const hashpassword = await bcrypt.hash(req.body.password, salt)
  req.body.password = hashpassword

  let model = new UserModel(req.body)
	model.save().then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
	//retornem el token id
	const token = jwt.sign({_id: doc.id}, process.env.TOKEN_SECRET)
		res.header('auth-token', token).send(token)
	}).catch(err => {
		res.status(500).json(err)
	})
}

// req.body  Post login
module.exports.login = async (req, res) => {
  	if(!req.body){
		return res.status(400).send('Request body is missing')
  	}
	
  	//Validar
  	const { error } = loginValidation(req.body)
  	if(error)return res.status(400).send(error.details[0].message)
	
  	//comprobar si existeix el correu
  	const user = await UserModel.findOne({ email: req.body.email})
  	if(!user) return res.status(400).send('Email or password is wrong')
		//implementar mes endavant
  	//const usernameExists = await UserModel.findOne({ username: req.body.username})
  	//else if(!usernameExists) return res.status(400).send('Username already exists')
	
  	//Comprovem la password
  	const validPass = await bcrypt.compare(req.body.password, user.password)
  	if(!validPass) return res.status(400).send('Email or password is wrong')
  	
  	//creem i assignem el token del usuari
  	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

	res.header({'authToken': token,'username': user.username}).send()
}

module.exports.getUser = (req, res) => {
  if(!req.query.email){
	return res.status(400).send('missing url parameter: email')
  }
  UserModel.findOne({
	email: req.query.email
  },{ _id: 0,  username: 1, name: 1, descripcio: 1, email: 1, role: 1 }).then(doc =>{
	res.json(doc)
  }).catch(err =>{
	res.stats(500).json(err)
  })
}

module.exports.getMyInfo = (req, res) => {
  if(!req.query.email){
	return res.status(400).send('missing url parameter: email')
  }
  //TODO fer que sigui amb el token:
  // token:  req.header('auth-token')
  UserModel.findOne({
	email: req.query.email
  },{ username: 1, name: 1, descripcio: 1, email: 1, role: 1 }
  ).then(doc =>{
	res.json(doc)
  }).catch(err =>{
	res.stats(500).json(err)
  })
}

module.exports.getAllUsers = (req, res) => {
  UserModel.find({
  }).then(doc =>{
	res.json(doc)
  }).catch(err =>{
	res.stats(500).json(err)
  })
}




module.exports.updateUser = (req, res) => {
  if(!req.query.email) {
	return res.status(400).send('Missing URL parameter: email')
  }

  UserModel.findOneAndUpdate({
	email: req.query.email
  }, req.body, {
	new: true
  })
	.then(doc => {
	  res.json(doc)
	})
	.catch(err => {
	  res.status(500).json(err)
	})
}

module.exports.deleteUser = (req, res) => {
  if(!req.query.email) {
	return res.status(400).send('Missing URL parameter: email')
  }

  UserModel.findOneAndRemove({
	email: req.query.email
  })
	.then(doc => {
	  res.json(doc)
	})
	.catch(err => {
	  res.status(500).json(err)
	})
}


  