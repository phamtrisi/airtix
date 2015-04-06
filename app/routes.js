module.exports = function(app) {
  app.get('*', function(req, res) {
    res.render('../static/index.html'); // load our public/index.html file
  });
};