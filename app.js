var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
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
// Country names list
var counries = Object.keys(counrtyData).map(function (key) {
  return counrtyData[key].Name;
});
//console.log(counries);
// Country codes list
var counrty_codes = Object.keys(counrtyData).map(function (key) {
  return counrtyData[key].Code;
});
//console.log(counrty_codes);

var globe = ['-180','-90','180','90'];
var stream = twitter.stream('statuses/filter', { locations: globe });
stream.on('tweet', function (tweet) {
  if (tweet.place) {
    // var country = tweet.place['country'];
    // if (country) {
    //   if(counries.indexOf(country) === -1){
    //     counries.push(country);
    //   } else {
    //     sockIO.emit('country_list', counries);
    //   }
    // } else {
    //   console.log('no country');
    // }
    // var countryCode = tweet.place['country_code'];
    // if (countryCode) {
    //   if(counrty_codes.indexOf(countryCode) === -1){
    //     counrty_codes.push(countryCode);
    //   } else {
    //     sockIO.emit('country_code_list', counrty_codes);
    //     console.log(counrty_codes);
    //   }
    // } else {
    //   console.log('no counrty code');
    // }
  }
});

sockIO.on('connection', function (socket) {
  console.log('user enter');
  sockIO.emit('country_list', counries);
  sockIO.emit('country_code_list', counrty_codes);
  socket.on('disconnect', function(){
    console.log('user exit');
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
