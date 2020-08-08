const User = require("../models/users");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

exports.create = (req, res, next) => {

  const {name, email, password, password2, role, rtype, secTkn} = req.body;

  if(rtype === "AR"){
    if(typeof(secTkn) !== "undefined") {
        let check = 1;
        jwt.verify(secTkn, "mysecretissecret", (err, data) => {
            if(err) {
              check = 0;
            }
        });
        if(!check){
            res.send({status: 403, message: "Forbidden Access!"});
            return;
        }
    } else {
        res.send({status: 403, message: "Forbidden Access!"});
        return;
    }
  }

  if(name === "" || email === "" || password === "" || password2 === "" || role === ""){
    res.send({status: 500, message: "Be sure to fill in all the fields!"});
    return;
  }

  if(password !== password2){
    res.send({status: 500, message: "Password does not match! Please Try Again Later."});
    return;
  }
  User.findOne({email: email}, (err, user) => {
    if(user){
      res.send({message: "Email id is already registered", status: 500});
      return;
    } else {
      if(rtype === "OR" && role === 0){
        var status = "NA"
        var plan = "NA"
      } else {
        var status = "NN"
        var plan = "NN"
      }
      var date = new Date();
      var dor = ("0" + date.getDate()).substr(-2) + '-' + ("0" + (date.getMonth() + 1)).substr(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' +
        + ("0" + date.getMinutes()).substr(-2) + ':' + ("0" + date.getSeconds()).substr(-2);
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        role: role,
        dateofreg: dor,
        subscription: {
          status,
          plan
        }
      })
      let hashPassword = crypto.createHash('md5').update(password).digest("hex");
      newUser.password = hashPassword;
      newUser.save((err) => {
        if(!err){
          res.send({message: "Successfully Signed up!", status: 200});
          return;
        } else {
          // console.log(err);
          res.send({message: "Unable to process your request! Please try again later", status: 500});
          return;
        }
      })
    }
  })

};

exports.read = (req, res) => {
    const {email, password, role} = req.body;
    if(email === "" || password === ""){
      res.send({status: 500, message: "Be sure to fill in all the fields!"});
      return;
    }
    if(typeof(password) !== "undefined"){
	      var hashpassword = crypto.createHash('md5').update(req.body.password.toString()).digest("hex");
    }
    User.findOne({email: email, role: role}, (err, user) => {
        if(err) {
            res.send({status: 500, message: "Unable to process your request! Please Try Again Later.", error: err});
        } else {
            if(!user) {
                res.send({status: 404, message: "User not found!"});
            } else {
                if(user.password === hashpassword){
                  jwt.sign({user}, 'mysecretissecret', (err, token) => {
                    if(!err)
                      res.send({status: 200, message: "Success!", user: user, token: token});
                    else
                      res.send({status: 500, message: "Unable to process your request! Please Try Again Later.", error: err});
                  });
                  
                } else {
                  // console.log(err);
                  res.send({status: 400, message: "Invalid Credentials!"});
                }
                
            }
        }
    });

};

exports.readall = (req, res) => {
  User.find({role:"1"}, (err, fusers) => {
    if(!err){
      User.find({role:"0"}, (err, susers) => {
        if(!err){
          if(fusers.length === 0){
            fusers = []
          }
          if(susers.length === 0){
            susers = []
          }
          res.send({status: 200, message: "Success", fusers: fusers, susers: susers})
        } else {
          // console.log(err);
          res.send({status: 500, message: "Unable to process your request at the moment!"})
        }
      })
    } else {
      // console.log(err);
      res.send({status: 500, message: "Unable to process your request at the moment!"})
    }
  })
  
  
}

exports.update = (req, res) => {
  const {oldpassword, newpassword, newpassword2, userId} = req.body;
  if(oldpassword === "" || newpassword === "" || newpassword2 === ""){
    res.send({status: 500, message: "Be sure to fill in all the fields!"});
    return;
  }
  if(newpassword !== newpassword2){
    res.send({status: 500, message: "Password does not match! Please Try Again Later."});
    return;
  }
  if(oldpassword === newpassword){
    res.send({status: 500, message: "Your new password should not be same as the old password!."});
    return;
  }
  var hasholdPassword = crypto.createHash('md5').update(oldpassword).digest("hex");
  var hashnewPassword = crypto.createHash('md5').update(newpassword).digest("hex");
  User.findOneAndUpdate({_id: userId, password: hasholdPassword}, {password: hashnewPassword}, {new: true}, (err, user) => {
    if(!err){
      if(!user){
        res.send({status: 404, message: "Your old passowd does not macth our record!!"})
      } else {
        res.send({status: 200, message: "Success!"})
      }
    } else {
      // console.log(err);
      res.send({status: 500, message: "Unable to process your request at the moment!"})
    }
  })
}
