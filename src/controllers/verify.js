const jwt = require('jsonwebtoken')
const { UserModel }  = require('../models/user')

//funcio que comproba si el usuari te token assignat

function verifyToken(req, res, next) {

	const token = req.header('auth-token');
	const tokenWeb = req.cookies.token;
	//Mirem si rebem token de la App o Web
	if(tokenWeb && tokenWeb !== undefined) {
		try{
			//Verifiquem token
			const verified = jwt.verify(tokenWeb, process.env.TOKEN_SECRET)
			req.user = verified
			next()
		}catch(err){
			//Tornem error si el token no es correcte
			return res.status(401).send({error: 'Invalid Token'})
		}
	}
	else if(token && token !== undefined && !tokenWeb){
		try{
			//Verifiquem token
			const verified = jwt.verify(token, process.env.TOKEN_SECRET)
			req.user = verified
			next()
		}catch(err){
			//Tornem error si el token no es correcte
			return res.status(402).send({error: 'Invalid Token'})
		}
	}
	else return res.status(403).send({error: 'Invalid Token'})
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
