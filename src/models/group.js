const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema ({
    creator: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	},
	text: {
		type: String,
		required: true,
		min: 1,
		max: 256
	},
});
const LikeSchema = new mongoose.Schema ({
    user: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	},
});
const PostSchema = new mongoose.Schema ({
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
		min: 6,
		max: 256
	},
	likes:[{
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	}],
	comments: [{
	 	type: CommentSchema
	}],
	//direccio de la imatge
	image:{
		type: String,
	}
},{ timestamps : true });

const ResourceSchema = new mongoose.Schema ({
    creator: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User'
	},
	title: {
		type: String,
		required: true,
		max: 256
	},
	type:{
		type: String,
		num: [
	        'link',
	        'pdf',
	        'none'
	    ],
	    default: 'none',
	},
	//ruta del recurs
	link: {
		type: String,
		required: true,
		min: 1,
		max: 256
	},
});

let GroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	 	unique:true,
	 	min: 6,
		max: 255
	},
	subtitle: {
		type: String,
	 	min: 6,
		max: 511
	},
	description: {
	  	type: String,
	  	required: true,
	  	min: 8,
	  	max: 2048
	},
	image: {
		type: String,
	  	min: 5,
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
	        'project',
	        'ordinary',
	    ],
	    default: 'ordinary',
	},
	//project values
	numMembers:{
		type: Number,
	},
	totalMembers:{
		type: Number,	
	},
	state:{
		type: String,
	    enum: [
	        'preparing',
	        'underConstruction',
	        'ended',
	    ],
	    default: 'preparing',
	},
	open: {
		type: Boolean,
		default: false,
	},
	city:{
		type: String,
	},
	province:{
		type:String,
	},
	location:{
		type:String,
	},
	//
	posts:[{
		type: PostSchema,
	}],
	resources:[{
		type: ResourceSchema,
	}],
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
exports.PostModel = mongoose.model('Post', PostSchema);
exports.CommentModel = mongoose.model('Comment', CommentSchema);
exports.ResourceModel = mongoose.model('Resource', ResourceSchema);
