const Comment = require("../models/comments");
const crypto = require("crypto");

exports.create = (req, res) => {
  console.log(req);

  const {user, msg} = req.body;

  const comment = new Comment({
    username: user,
    message: msg
  })

  comment.save((err) => {
    if(err){
      res.send({message: "Unable to add your comment", status: 500})
    } else {
      res.send({message: "Comment Added!", status: 200})
    }
  })
};

exports.readAll = (req, res) => {
    Comment.find({}, (err, comments) => {
        if(err) {
            res.send({status: 500, message: "Unable to fetch comments! Please Try Again Later.", error: err});
        } else {
            if(comments.length > 0) {
                res.send({status: 200, message: "Successfully!", comments: comments});
            } else {
                res.send({status: 404, message: "No comments Found"});
            }
        }
    });
};
