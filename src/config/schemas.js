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
	const loginValidation = Joi.object({
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return loginValidation.validate(data, options)
}

//Validar update 
const updateValidation = (data) => {
	const updateValidation = Joi.object({
		username: Joi.string().min(6),
		name: Joi.string().min(6),
		email: Joi.string().min(6).email(),
		password: Joi.string().min(6),
		descripcio: Joi.string().min(6)
	})
	return updateValidation.validate(data, options)
}

//Validar grup 
const groupValidation = (data) => {
	const groupValidation = Joi.object({
	  	name: Joi.string().min(6).required(),
	  	description: Joi.string().min(8).required(),
	  	owner: Joi.string().required(),
	  	members: Joi.array().unique().items(Joi.string())
	})
	return groupValidation.validate(data, options)
}

//segon registre
const secondRegisterValidation = (data) => {
	const secondRegisterValidation = Joi.object({
	  	username: Joi.string().min(6).required(),
	  	name: Joi.string().min(6).required(),
	  	email: Joi.string().min(6).required().email(),
	  	password: Joi.string().min(6).required()
	})
	return secondRegisterValidation.validate(data, options)
}

//Validar noticia
const newValidation = (data) => {
	const newValidation = Joi.object({
	  	title: Joi.string().min(6).required(),
	  	subtitol: Joi.string(),
	  	text: Joi.string(),
	  	image: Joi.string(),
	  	day: Joi.number().max(31),
	  	month: Joi.number().max(12),
	  	year: Joi.number(),
	})
	return newValidation.validate(data, options)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.groupValidation = groupValidation
module.exports.newValidation = newValidation  
module.exports.updateValidation = updateValidation