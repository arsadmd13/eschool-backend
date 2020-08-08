const mongoose = require('mongoose');

const orderSchema = {
  userId:{
    type: String,
    required: true
  },
  order_id:{
    type: String,
    required: true
  },
  receipt_id:{
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  ocd: {
    type: String,
    required: false
  },
  order_status: {
    type: String,
    required: true
  },
  payment_id: {
    type: String,
    required: false
  },
  signature: {
    type: String,
    required: false
  }
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
