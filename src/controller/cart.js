const Razorpay = require("razorpay");
const SHA256 = require("crypto-js/sha256");
const Cart = require("../models/cart");

exports.create = (req, res) => {
    const {userId, amount, item, fullplanname} = req.body;
    Cart.findOne({userId}, (err, resultData) => {
        if(!err){
            if(!resultData){
                const cart = new Cart({
                    userId,
                    item,
                    amount,
                    fullplanname
                }).save((err) => {
                    if(!err){
                        res.send({status: 200, message: "Success"});
                    } else {
                        res.send({status: 500, message: "Unable to add the item to the cart!", error: err});
                    }
                })
            } else {
                Cart.updateOne({userId}, {item, amount, fullplanname}, (err) => {
                    if(!err){
                        res.send({status: 200, message: "Success"});
                    } else {
                        res.send({status: 500, message: "Unable to add the item to the cart!", error: err});
                    }
                });
            }
        }
    })
    
}

exports.read = (req, res) => {
    const {userId} = req.body;
    Cart.findOne({userId}, (err, resultData) => {
        if(!err){
            if(resultData === null){
                res.send({status: 404, message: "No items found"})
            } else if(resultData !== undefined){
                res.send({status: 200, message: "Success", items: [resultData]})
            } else {
                res.send({status: 404, message: "No items found"})
            }
        } else {
            res.send({status: 500, message: "Failed", error: err});
        }
    })
}

exports.delete = (req, res) => {
    const {userId, fullplanname} = req.body;
    Cart.deleteOne({userId, fullplanname}, (err) => {
        if(!err){
            res.send({status: 200, message: "Success"})
        } else {
            res.send({status: 500, message: "Failed", error: err});
        }
    })

}