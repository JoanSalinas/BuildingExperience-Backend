const mongoose = require('mongoose');

let MessageSchema = new mongoose.Schema({
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
    }
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


exports.MessageSchema = MessageSchema;
exports.MessageModel = mongoose.model('Message', MessageSchema);
