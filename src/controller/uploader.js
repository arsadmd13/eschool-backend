var multer = require('multer');
var path = require('path');
const crypto = require('crypto');
const Upload = require("../models/upload");


exports.upload = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);

  var hashfile = ""
  var originalname = ""

var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/uploads');
    },
    filename:function(req,file,cb){
      hashfile = crypto.createHash('md5').update(file.originalname).digest("hex")
      originalname = file.originalname;
        cb(null, originalname);
    }
});


var upload = multer({storage:store}).single('image');

upload(req,res,function(err){
    if(err){
        res.send({status: 500, error:"Unable to process your request!"});
    } else {
      var videoUrl = "https://nameless-plateau-81910.herokuapp.com/renderVideo/"+hashfile;
      const videoData = new Upload({
        hashfile: hashfile,
        originalname: originalname,
        videoUrl: videoUrl
      });
      videoData.save();
      res.send({status: 200, error:"Success!", originalname:originalname});
    }

});


}

exports.read = (req, res, next) => {
  Upload.find({}, (err, videos) => {
      if(err) {
          res.send({status: 500, message: "Unable to fetch videos! Please Try Again Later.", error: err});
      } else {
          if(videos.length > 0) {
              res.send({status: 200, message: "Successfully!", videos: videos});
          } else {
              res.send({status: 404, message: "No videos Found"});
          }
      }
  });
}


exports.render = (req, res, next) => {
  const videoPath = path.join(__dirname, '../../public/uploads/');
  Upload.find({_id: req.params.vid}, (err, video) => {
      if(err) {
          res.send({status: 500, message: "Unable to fetch videos! Please Try Again Later.", error: err});
      } else {
          if(video.length == 1) {
              res.sendFile(videoPath + video[0].originalname);
          } else {
              res.send({status: 404, message: "No videos Found"});
          }
      }
  });
}
