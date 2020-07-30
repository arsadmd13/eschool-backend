const authentication = require("../controller/authentication");
const cors = require('cors')

module.exports = (app) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post("/faculty/register", authentication.create);

  app.post("/faculty/login", authentication.read);

};
