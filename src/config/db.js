let mongoose = require('mongoose')

//info de la conexio
//const server = 'cluster0-boloh.gcp.mongodb.net'
//const database = 'Building'
//const user = 'joan'
//const password = 'dianaDK13'
async function connectDb(){

	mongoose.set('useUnifiedTopology', true);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useFindAndModify', false);
	// DE MOMENT LOCALHOST
	var mongoDB = 'mongodb://127.0.0.1/Building';
	mongoose.connect(mongoDB, { useNewUrlParser: true });
	/*mongoose.connect(process.env.DB_CONNECION, 
		{ useNewUrlParser: true }, 
		() => console.log('connected to DB!')
	)*/
	mongoose.connection
		.once('open', () => console.log('Mongodb running'))
		.on('error', err => console.error(err));
}
exports.connectDb = connectDb;
/*exports = {
    User: require('../models/user')
};*/

