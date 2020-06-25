//Validar
const Joi = require('@hapi/joi')

//Validar registre 
const registerValidation = (data) => {
	const registerValidation = Joi.object({
	  	username: Joi.string().min(6).required(),
	  	name: Joi.string().min(6).required(),
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data)
}

//Validar login 
const loginValidation = (data) => {
	const registerValidation = Joi.object({
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data)
}

//Validar grup 
const groupValidation = (data) => {
	const registerValidation = Joi.object({
	  	name: Joi.string().min(6).required(),
	  	description: Joi.string().min(8).required(),
	  	owner: Joi.string().required(),
	  	members: Joi.array().unique().items(Joi.string())
	})
	return registerValidation.validate(data)
}

//segon registre
const secondRegisterValidation = (data) => {
	const registerValidation = Joi.object({
	  	username: Joi.string().min(6).required(),
	  	name: Joi.string().min(6).required(),
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.groupValidation = groupValidation