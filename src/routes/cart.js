const cart = require("../controller/cart");
const verifyToken = require("../middleware/jwtauth.middleware")

module.exports = (app) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post("/cart/add", verifyToken, cart.create);

  app.post("/cart/read", verifyToken, cart.read);

  app.post("/cart/delete", verifyToken, cart.delete);

};
