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

var stream = twitter.stream('statuses/filter', { track: ['rain', 'sun'] });
var countRain = 0;
var countSun = 0;
stream.on('tweet', function (tweet) {
  var tweetContent = tweet['text'].toLowerCase();
  var tweetContentRain = tweetContent.includes('rain');
  var tweetContentSun = tweetContent.includes('sun');
  if (tweetContentRain === true) {
    //console.log('rain');
    countRain++;
    sockIO.emit('rain_count', countRain);
  }

  if (tweetContentSun === true) {
    //console.log('sun');
    countSun++;
    sockIO.emit('sun_count', countSun);
  }
});

sockIO.on('connection', function (socket) {
  console.log('user enter ' + countSun + " < SUN ----- RAIN > " + countRain);
  sockIO.emit('sun_count', countSun);
  sockIO.emit('rain_count', countRain);
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
