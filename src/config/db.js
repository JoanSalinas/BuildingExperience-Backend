let mongoose = require('mongoose')

//info de la conexio
//const server = 'cluster0-boloh.gcp.mongodb.net'
//const database = 'Building'
//const user = 'joan'
//const password = 'dianaDK13'

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECION, 
	{ useNewUrlParser: true }, 
	() => console.log('connected to DB!')
)

module.exports = {
    User: require('../models/user')
};

module.exports = mongoose