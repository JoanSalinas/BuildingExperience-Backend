const jwt = require('jsonwebtoken')
const { UserModel }  = require('../models/user')
//const token_secret = 'simplementuntextrandombastantllarg'

//funcio que comproba si el usuari te token assignat

function verifyToken(req, res, next) {

	const token = req.header('auth-token')
	if(!token) return res.status(401).send({error: 'Acces Denied, token required'})

	try{
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)
		req.user = verified
		console.log(req.user._id)
		next()
	}catch(err){
		res.status(400).send({error: 'Invalid Token'})
	}
}

function verifyTokenSocket(token) {
	try{
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)
		let user = verified
		return user;
	}catch(err){
		return false;
	}
}

function verifyAdmin(req, res, next) {
	//verifyToken(req, res, next);
	try{
		UserModel.findOne({
		   _id: req.user._id,
		   role: 'admin'
	    }).then(doc => {
	    	if(doc) next();
	  		else res.status(401).send({error: 'Acces Denied'})
	    })    
	}catch(err){
		res.status(400).send({error: 'Acces Denied'})
	}
}

module.exports.verifyToken = verifyToken;
module.exports.verifyTokenSocket = verifyTokenSocket;
module.exports.verifyAdmin = verifyAdmin;
/*
module.exports = function(token,  next) {
	if(!token) return false

	try{
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)
		console.log("verified?",verified)
		return verified
	}catch(err){
		return false
	}
}*/