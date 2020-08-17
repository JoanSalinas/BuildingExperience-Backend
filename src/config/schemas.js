//Validar
const Joi = require('joi')

//Aixo fa falta sino apareix el error amb ""
const options = {
	errors: {
		wrap: {
			label: ''
		}
	}
};

//Validar registre 
const registerValidation = (data) => {
	const registerValidation = Joi.object({
	  	username: Joi.string().min(6).required(),
	  	name: Joi.string().min(6).required(),
	  	email: Joi.string().min(6).required().email({ tlds: { allow: false } }),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data, options)
}

//Validar login 
const loginValidation = (data) => {
	const registerValidation = Joi.object({
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data, options)
}

//Validar grup 
const groupValidation = (data) => {
	const registerValidation = Joi.object({
	  	name: Joi.string().min(6).required(),
	  	description: Joi.string().min(8).required(),
	  	owner: Joi.string().required(),
	  	members: Joi.array().unique().items(Joi.string())
	})
	return registerValidation.validate(data, options)
}

//segon registre
const secondRegisterValidation = (data) => {
	const registerValidation = Joi.object({
	  	username: Joi.string().min(6).required(),
	  	name: Joi.string().min(6).required(),
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return registerValidation.validate(data, options)
}

//Validar noticia
const newValidation = (data) => {
	const registerValidation = Joi.object({
	  	title: Joi.string().min(6).required(),
	  	subtitol: Joi.string(),
	  	text: Joi.string(),
	  	image: Joi.string(),
	  	day: Joi.number().max(31),
	  	month: Joi.number().max(12),
	  	year: Joi.number(),
	})
	return registerValidation.validate(data, options)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.groupValidation = groupValidation
module.exports.newValidation = newValidation