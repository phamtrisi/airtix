module.exports = function(app) {  
  app.get('*', function(req, res) {
    res.sendfile('./static/templates/index.html');
  });
};
