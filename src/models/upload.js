const mongoose = require('mongoose');

const uploadSchema = {
  hashfile:{
    type: String,
    required: true
  },
  originalname:{
    type: String,
    required: true
  },
  videoUrl:{
    type: String,
    required: true
  }
}

const Upload = mongoose.model('Upload', uploadSchema)

module.exports = Upload
