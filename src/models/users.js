const mongoose = require('mongoose');

const userSchema = {
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  },
  dateofreg:{
    type: String,
    required: true
  },
  subscription: {
    status: {
      type: String,
      required: false
    },
    plan: {
      type: String,
      required: false
    }
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
