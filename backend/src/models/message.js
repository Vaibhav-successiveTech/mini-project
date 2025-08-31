import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MessageModel = mongoose.model('message', MessageSchema);
export default MessageModel;
