const { NoticiaModel } = require('../models/noticia');
const { newValidation } = require('../config/schemas')

module.exports.getNews = (req, res) => {
	NoticiaModel.find({})
	.then(doc =>{
		res.json(doc)
	}).catch(err =>{
		res.status(500).json(err)
	})
}

module.exports.createNew = async (req, res) => {

	const { error } = newValidation(req.body)
	if(error) return res.status(400).send(error.details[0].message)


	let noticia = new NoticiaModel(req.body);
	noticia.creator = req.user._id;

	noticia.save().then(doc => {
		if(!doc || doc.length === 0){
			return res.status(500).send(doc)
		}
		res.header().send(doc);		
	}).catch(err => {
		res.status(500).json(err)
	})
}




