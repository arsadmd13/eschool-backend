const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const db = require("./src/config/db").MongoURI
const	streams = require('./src/app/streams.js')();
const cors = require('cors')
const path = require('path')

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("DB Connected!"));

const app = express()

var corsOptions = {
  origin: "https://angry-babbage-4c01cb.netlify.app"
};

app.use(cors());

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/src/views'))
app.set("view engine", "ejs");


require("./src/routes/authentication")(app);
require("./src/routes/comment")(app);
require("./src/routes/uploader")(app);

require('./src/routes/livestream.js')(app, streams);

var server = app.listen(process.env.PORT || 3000, () => console.log("Server is up and running!"))

var io = require('socket.io').listen(server);

require('./src/app/socketHandler.js')(io, streams);
