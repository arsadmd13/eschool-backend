module.exports = function(app, streams) {


  app.get('/watchstream', (req, res) => {
    res.render('view', {title:"Watch Stream"})
  })

  app.get('/streamlive', (req, res) => {
    res.render('index', {title:"Live Stream"})
  })

  var displayStreams = function(req, res) {
    var streamList = streams.getStreams();
    var data = (JSON.parse(JSON.stringify(streamList)));
    res.status(200).json(data);
  };

  app.get('/streams.json', displayStreams);


}
