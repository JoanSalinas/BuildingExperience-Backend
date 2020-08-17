const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const MessageSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      min: 1,
      max: 255,
    },
    seenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    messageType: {
      type: String,
      enum: [
        'text',
        'file',
        'image',
        'audio',
      ],
      default: 'text',
    },
    fileLink: {
      type: String,
      default: '',
    },
    date:{
      type: Date,
      default: Date.now()
    }
})

const ChatSchema = new mongoose.Schema({
    name: {
      type: String,
      default: '',
    },
    chatIcon: {
      type: String,
      default: 'https://raw.githubusercontent.com/jovanidash21/chat-app/master/public/images/default-chat-icon.jpg',
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    chatType: {
      type: String,
      enum: [
        'private',
        'direct',
        'group',
        'public',
      ],
      default: 'group',
    },
    messages:[ MessageSchema ],
    latestMessage: MessageSchema,

  },{ timestamps : true});

exports.ChatSchema = ChatSchema;
exports.ChatModel =  mongoose.model('Chat', ChatSchema);