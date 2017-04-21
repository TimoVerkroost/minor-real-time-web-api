var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var sockIO = require('socket.io')();
var Twit = require('twit');

require('dotenv').config();

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var index = require('./routes/index');

var app = express();

app.use(compression());

// Init socket.io
app.sockIO = sockIO;

/* Source of country data: http://data.okfn.org/data/core/country-list#resource-data */
var counrtyData = require('./countries.json');

var countObject = Object.keys(counrtyData).map(function (key) {
  return {
    name: counrtyData[key].Name,
    code: counrtyData[key].Code,
    count: 0
  };
});

var totalCount = 0;

var globe = ['-180','-90','180','90'];
var stream = twitter.stream('statuses/filter', { locations: globe });
stream.on('tweet', function (tweet) {
  if (tweet.place) {
    var countryCode = tweet.place['country_code'];
    if (countryCode) {
      for (var i = 0; i < countObject.length; i++) {
        if (countObject[i].code === countryCode){
          countObject[i].count++;
          totalCount++;
          // Update webpage
          sockIO.emit('country_code_list_count', countObject, totalCount);
        }
      }
    } else {
      console.log('no counrty code');
    }
  }
});

// Update every 5000 milliseconds the page
// setInterval(function() {
//   sockIO.emit('country_code_list_count', countObject);
// }, 5000);

sockIO.on('connection', function (socket) {

  console.log('user enter');
  //sockIO.emit('country_list', counries);
  sockIO.emit('country_code_list', countObject, totalCount);
  socket.on('disconnect', function(){
    console.log('user exit');
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
