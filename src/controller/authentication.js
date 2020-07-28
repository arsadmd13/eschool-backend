const User = require("../models/users");
const crypto = require("crypto");

exports.create = (req, res) => {
  const {name, email, password, password2, role} = req.body;

  if(name == "" || email == "" || password == "" || password2 == ""){
    res.send({status: 500, message: "Be sure to fill in all the fields!"});
    return;
  }

  if(password !== password2){
    res.send({status: 500, message: "Passwoord does not match! Please Try Again Later."});
    return;
  }
  User.findOne({email: email}, (err, user) => {
    if(user){
      res.send({message: "Email id is already registered", status: 500});
      return;
    } else {
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        role: role
      })
      let hashPassword = crypto.createHash('md5').update(password).digest("hex");
      newUser.password = hashPassword;
      newUser.save((err) => {
        if(!err){
          res.send({message: "Successfully Signed up!", status: 200});
          return;
        } else {
          res.send({message: "Unable to process your request! Please try again later", status: 500});
          return;
        }
      })
    }
  })

};

exports.read = (req, res) => {
    let email = req.body.email;
    let role = req.body.role;
    if(typeof(req.body.password) !== "undefined"){
	      var password = crypto.createHash('md5').update(req.body.password.toString()).digest("hex");
    }
    User.findOne({email: email, password: password, role: role}, (err, user) => {
        if(err) {
            res.send({status: 500, message: "Unable to process your request! Please Try Again Later.", error: err});
        } else {
            if(!user) {
                res.send({status: 404, message: "User not found!"});
            } else {
              console.log(user);
                res.send({status: 200, message: "Success!", user: user});
            }
        }
    });

};
