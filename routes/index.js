var express = require('express');
var router = express.Router();

// Get server start time UTC format
var startServer = new Date();
var dd = startServer.getUTCDate();
var mm = startServer.getUTCMonth()+1; //January is 0!
var yyyy = startServer.getUTCFullYear();
var hours = startServer.getUTCHours();
var minutes = startServer.getUTCMinutes();

// Generate time so server client side
startServer = ("0" + dd).slice(-2) + '/' + ("0" + mm).slice(-2) + '/' + yyyy + ' - ' + ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.countries = require('../app.js').countObject;
  res.render('index', { title: 'Tweet counter', startServer: startServer});
});

module.exports = router;
