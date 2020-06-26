const jwt = require('jsonwebtoken')
//const token_secret = 'simplementuntextrandombastantllarg'

//funcio que comproba si el usuari te token assignat

function verifyToken(req, res, next) {
	const token = req.header('auth-token')
	if(!token) return res.status(401).send({error: 'Acces Denied, token required'})

	try{
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)
		req.user = verified
		next()
	}catch(err){
		res.status(400).send({error: 'Invalid Token'})
	}
}

module.exports = verifyToken;
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