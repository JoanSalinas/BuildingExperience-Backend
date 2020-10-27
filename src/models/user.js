const mongoose = require('mongoose');

//en cas que es vulgui mutejar un grup
const chatMutedDateSchema = new mongoose.Schema ({
    data: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id : false,
  },
);

//info del chat
const userChatsSchema = new mongoose.Schema ({
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    unReadMessages: {
      type: Number,
      default: 0,
    },
    mute: chatMutedDateSchema,
  },
  {
    _id : false,
  },
);

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
    image:{
      type: String,
      default: '/profilePictures/defaultColorUser.png',
    },
    //talent sharing
    descripcio:{
      type: String,
      default:'Membre de Som Cohousing',
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
    token:{
      type: String
    },
    role: {
      type: String,
      enum: [
        'admin',
        'member',
        'ordinary',
      ],
      default: 'ordinary',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketID: {
      type: String,
      default: '',
    }
},{ timestamps : true})

exports.UserSchema = UserSchema;
exports.UserModel = mongoose.model('User', UserSchema);
