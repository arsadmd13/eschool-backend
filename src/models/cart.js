const mongoose = require('mongoose');

const cartSchema = {
  userId:{
    type: String,
    required: true
  },
  item:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  },
  fullplanname: {
    type: String,
    required: true
  }
}

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
