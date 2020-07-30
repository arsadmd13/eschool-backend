const Comment = require("../models/comments");
const crypto = require("crypto");

exports.add = (req, res) => {

  const {username, message, streamId} = req.body;

  const comment = new Comment({
    username: username,
    message: message,
    streamId: streamId
  })

  comment.save((err) => {
    if(err){
      res.send({message: "Unable to add your comment", status: 500, error: err})
    } else {
      res.send({message: "Comment Added!", status: 200})
    }
  })
};

exports.readAll = (req, res) => {
    const { streamId } = req.body;
    //console.log(streamId);
    Comment.find({streamId: streamId}, (err, comments) => {
        if(err) {
            res.send({status: 500, message: "Unable to fetch comments! Please Try Again Later.", error: err});
        } else {
            if(comments.length > 0) {
                res.send({status: 200, message: "Success!", comments: comments});
            } else {
                res.send({status: 404, message: "No comments Found"});
            }
        }
    });
};
