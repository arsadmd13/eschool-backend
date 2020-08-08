const order = require("../controller/order");
const verifyToken = require("../middleware/jwtauth.middleware")

module.exports = (app) => {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post("/order", order.create);

  app.post("/order/update", verifyToken, order.update);

  app.post('/order/read', verifyToken, order.read);

  app.post('/order/readall', verifyToken, order.readall);

};