const comment = require("../controller/comment");

module.exports = (app) => {

  app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'https://angry-babbage-4c01cb.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

    app.post("/comment/add", comment.create);

    app.get("/comment/read", comment.readAll);


};
