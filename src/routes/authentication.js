const authentication = require("../controller/authentication");
const verifyToken = require("../middleware/jwtauth.middleware");

module.exports = (app) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post("/user/register", authentication.create);

  app.post("/user/login", authentication.read);

  app.post("/user/read", verifyToken, authentication.readall);

  app.post("/user/update", verifyToken, authentication.update);

};
