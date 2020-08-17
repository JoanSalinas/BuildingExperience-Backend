const mongoose = require('mongoose');

//de moment es el concepte, despres es pot afegir mes coses
let FAQSchema = new mongoose.Schema({
	category:{
		type: String,
		min: 3,
		max: 256
	}
	question: {
		type: String,
		required: true,
		min: 5,
		max: 256
	},
	answer:{
	 	type: String,
	 	required: true,
	 	min: 5,
	 	max: 2048
	},
	text: {
		type: String,
		required: true,
		min : 6,
		max: 256
	},
	//direccio de la imatge
	image:{
	  type: String,
	}

},{ timestamps : true})

exports.FAQSchema = FAQSchema;
exports.FAQModel = mongoose.model('FAQ', FAQSchema);
