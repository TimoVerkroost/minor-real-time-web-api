var express = require('express');
var router = express.Router();

var startServer = new Date();
var dd = startServer.getDate();
var mm = startServer.getMonth()+1; //January is 0!
var yyyy = startServer.getFullYear();
var hours = startServer.getUTCHours();
var minutes = startServer.getMinutes();

startServer = mm + '/' + dd + '/' + yyyy + ' - ' + hours + ':' + minutes;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tweet counter', startServer: startServer});
});

module.exports = router;
