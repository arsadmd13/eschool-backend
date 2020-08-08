require('dotenv').config({path: __dirname + '/.env'})
module.exports = {
  MongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@enigmatic-cluster.ctpuf.mongodb.net/eschool?retryWrites=true&w=majority`
  //MongoURI: 'mongodb://localhost:27017'
}
