var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var sockIO = require('socket.io')();
var Twit = require('twit');

require('dotenv').config();

// Twitter APP oAuth > config your .env file (view readme)
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var index = require('./routes/index');

var app = express();

// Gzip compression added
app.use(compression());

// Init socket.io
app.sockIO = sockIO;

/* Source of country data: http://data.okfn.org/data/core/country-list#resource-data */
var countryData = require('./countries.json');

// Countries object with count number, based on loaded "countryData".
var countObject = Object.keys(countryData).map(function (key) {
  return {
    name: countryData[key].Name,
    code: countryData[key].Code,
    count: 0
  };
});

// Count total Tweets in the whole world
var totalCount = 0;

// Get all Tweets around the world, this is a "bounding box" this coordinates are the whole globe.
// More info add: https://dev.twitter.com/streaming/overview/request-parameters#locations
var globe = ['-180','-90','180','90'];
var stream = twitter.stream('statuses/filter', { locations: globe });
stream.on('tweet', function (tweet) {
  // Check of the location of the Tweet is given.
  if (tweet.place) {
    // Get country code from single Tweet
    var countryCode = tweet.place['country_code'];
    // Check if countryCode exist in the Tweet data to prevent errors.
    if (countryCode) {
      for (var i = 0; i < countObject.length; i++) {
        if (countObject[i].code === countryCode){
          // Count single country
          countObject[i].count++;
          // Count all tweets
          totalCount++;
          // Update country data on client side
          sockIO.emit('country_code_list_count', countObject, totalCount);
        }
      }
    } else {
      // No country code in Tweet data
      console.log('no country code');
    }
  } else {
    // No place is added to Tweet data
    console.log('no place');
  }
});

// User connects to website
sockIO.on('connection', function (socket) {
  // Push the current state of countries data to the client side
  sockIO.emit('country_code_list', countObject, totalCount);
  socket.on('disconnect', function(){
    console.log('user exit');
  });
});

// view engine setup (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
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
