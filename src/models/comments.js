const mongoose = require('mongoose');

const commentSchema = {
  username:{
    type: String,
    required: true
  },
  message:{
    type: String,
    required: true
  }
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
