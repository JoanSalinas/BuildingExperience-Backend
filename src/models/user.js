let mongoose = require("../config/db")

let UserSchema = new mongoose.Schema({
  	username: {
    	type: String,
    	required: true,
    	min: 6,
    	max: 255
  	},
  	name: {
    	type: String,
    	required: true,
    	max: 255
  	},
  	email: {
  	  type: String,
  	  required: true,
  	  min : 6,
  	  max: 255
  	},
  	password: { 
  		type: String, 
  		required: true,
  		max: 1024,
  		min: 6
  	},
  	createdDate: { 
  		type: Date, 
  		default: Date.now 
  	}
})
module.exports = mongoose.model('Users', UserSchema)
