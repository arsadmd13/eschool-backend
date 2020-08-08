const uploader = require("../controller/uploader");
const verifyToken = require("../middleware/jwtauth.middleware")

module.exports = (app) => {

  app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');//https://angry-babbage-4c01cb.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.post('/video/upload', uploader.upload);

  app.post('/video/read', verifyToken, uploader.read);

  app.get('/renderVideo/:vid', uploader.render)

}

