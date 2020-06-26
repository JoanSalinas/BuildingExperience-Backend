const mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	 	unique:true,
	 	min: 6,
		max: 255
	},
	description: {
	  	type: String,
	  	required: true,
	  	min: 8,
	  	max: 2048
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
	  	ref: 'User'
	},
	type:{
		type: String,
	    enum: [
	        'admin',
	        'member',
	        'ordinary',
	    ],
	    default: 'ordinary',
	},
	members: [{
	 	type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	}],
	chat: {
	  	type: mongoose.Schema.Types.ObjectId,
	  	ref: 'Chat' 
	}
},{ timestamps : true })

GroupSchema.statics.addUser = async function(id, args) {
 	let User = mongoose.model('User');
 	console.log(id, args)
 	let group = await this.findById(id);
 	let user = new User({ ...args, group})
 	group.members.push(user);
 	let result = await Promise.all([user.save(), group.save])
}

exports.GroupSchema = GroupSchema;
exports.GroupModel = mongoose.model('Group', GroupSchema);
