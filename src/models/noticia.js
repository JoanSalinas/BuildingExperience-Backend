const mongoose = require('mongoose');

//de moment es el concepte, despres es pot afegir mes coses
let NoticiaSchema = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	},
	title: {
		type: String,
		required: true,
		max: 256
	},
	subtitol:{
	 	type: String,
	 	max: 500
	},
	text: {
		type: String,
		required: true,
		min : 6,
		max: 256
	},
	day:{
		type: Number,	
		max: 31
	},
	month:{
		type: Number,	
		max: 12
	},
	year:{
		type: Number,	
	},
	//direccio de la imatge
	image:{
	  type: String,
	}

},{ timestamps : true})

exports.NoticiaSchema = NoticiaSchema;
exports.NoticiaModel = mongoose.model('Noticia', NoticiaSchema);
