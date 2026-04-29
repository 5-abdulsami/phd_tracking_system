const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderDesignation: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Please add a comment'],
  },
  attachmentUrl: {
    type: String,
    default: '',
  },
  attachmentName: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Remark = mongoose.model('Remark', remarkSchema);
module.exports = Remark;
