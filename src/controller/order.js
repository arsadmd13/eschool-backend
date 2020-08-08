const Razorpay = require("razorpay");
const SHA256 = require("crypto-js/sha256");
const Order = require("../models/order");
const User = require("../models/users");
const Cart = require("../models/cart");

exports.create = (req, res) => {
    const date = new Date
    const current_date = date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds()
    const {userId, amount, item} = req.body;
    const receipt_id = userId + current_date
    var options = {
        amount: amount + "00",
        currency: "INR",
        receipt: receipt_id,
        payment_capture: '1'
    };
    var instance = new Razorpay({
        key_id: 'rzp_test_pXdODSmlRPHKap',
        key_secret: 'bQfZH2s1k65e4xByo5KBiSOf'
    })
    instance.orders.create(options).then((order) => {
        var unixDate = new Date(order.created_at * 1000);
        var ocd = ("0" + unixDate.getDate()).substr(-2) + '-' + ("0" +( unixDate.getMonth() + 1)).substr(-2) + '-' + unixDate.getFullYear() + ' ' + unixDate.getHours() + ':' + ("0" + unixDate.getMinutes()).substr(-2) + ':' + ("0" + unixDate.getSeconds()).substr(-2);
        const orderData = new Order({
            userId,
            order_id: order.id,
            receipt_id,
            item,
            amount,
            currency: "INR",
            ocd,
            order_status: "Pending/Failed"
        }).save((err) => {
            if(!err) {
                res.send({order : order, status : 200, message: "Success"});
            } else {
                res.send({error : err, status : 500, message: "Unable to process your request at  the moment"});
            }
        })
    }).catch((err) => {
        res.send({error : err, status : 500, message: "Unable to process your request at  the moment"});
    })
}

exports.read = (req, res) => {
    const { userId } = req.body;
    Order.find({userId}, (err, orders) => {
        if(!err){
            if(orders.length > 0)
                res.send({status : 200, message: "Success", orders: orders});
            else
                res.send({status : 404, message: "No orders found"});
        } else {
            res.send({status : 500, message: "Unable to process your request at  the moment"});
        }
    })
}

exports.update = (req, res) => {
    const { userId, order_id, order_status } = req.body;
    if(order_status === "Success"){
        const {payment_id, signature} = req.body;
        Order.findOneAndUpdate({userId, order_id}, {order_status, payment_id, signature}, (err, result) => {
            if(!err){
                Cart.deleteOne({userId}, (err) => {
                    if(!err){
                        User.updateOne({_id: userId}, {subscription: {status: "AV", plan: result.item}}, (err) => {
                            if(!err){
                                res.send({status : 200, message: "Success"});
                            } else {
                                res.send({status : 500, message: "Unable to process your request at  the moment"});
                            }
                        })
                    } else{
                        res.send({status : 500, message: "Unable to process your request at the moment"});
                    }
                });
            } else {
                res.send({status : 500, message: "Unable to process your request at  the moment"});
            }
        })
    } else {
        Order.findOne({userId, order_id}, (err, order) => {
            if(!err){
                if(order.order_status !== "Failed"){
                    Order.updateOne({userId, order_id}, {order_status}, (err) => {
                        if(!err){
                            res.send({status : 200, message: "Success"});
                        } else {
                            res.send({status : 500, message: "Unable to process your request at  the moment"});
                        }
                    })
                } else { return }
            } else {
                res.send({status : 500, message: "Unable to process your request at  the moment"});
            }
        })
    }
}

exports.readall = (req, res) => {
    Order.find({}, (err, orders) => {
        if(!err){
            if(orders.length > 0)
                res.send({status : 200, message: "Success", orders: orders});
            else
                res.send({status : 404, message: "No orders found"});
        } else {
            res.send({status : 500, message: "Unable to process your request at  the moment"});
        }
    })
}