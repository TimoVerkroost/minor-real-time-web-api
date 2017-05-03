var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var sockIO = require('socket.io')();
var Twit = require('twit');

// Env files support
require('dotenv').config();

// Twitter APP oAuth > config your .env file (view readme)
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

// Routers
var index = require('./routes/index');

// Start express server
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
    count: 0,
    tags: {}
  };
});

// Count total Tweets in the whole world
var totalCount = 0;

// Get all Tweets around the world, this is a "bounding box" this coordinates are the whole globe.
// More info add: https://dev.twitter.com/streaming/overview/request-parameters#locations
var globe = ['-180','-90','180','90'];
// Start Twitter streaming API
var stream = twitter.stream('statuses/filter', { locations: globe });

// Handle connection error Twitter streaming API and emit to client
stream.on('error', function (errMsg) {
  sockIO.emit('error_handle', errMsg);
});
// Check if connected to streaming API
stream.on('connected', function () {
  //console.log('Connected to streaming API Twitter');
});
// Handle disconnect Twitter streaming API and emit to client
stream.on('disconnect', function (disconnect) {
  sockIO.emit('error_handle', disconnect);
});
// Check when a Tweet is placed on Twitter
stream.on('tweet', function (tweet) {
  // Check of the location of the Tweet is given.
  if (tweet.place) {
    // Get country code from single Tweet
    var countryCode = tweet.place['country_code'];
    // Check if countryCode exist in the Tweet data to prevent errors.
    if (countryCode) {
      for (var i = 0; i < countObject.length; i++) {
        if (countObject[i].code === countryCode) {
          // Count single country
          countObject[i].count++;
          // Count all tweets
          totalCount++;
          // Update country data on client side
          sockIO.emit('country_code_list_count', countObject, totalCount);
          // If tweet has Hashtags
          var tweetHashtags = tweet.entities.hashtags;
          // Check if there are hashtags in Tweet, if yes run the code.
          if (tweetHashtags.length >= 1) {
            for (var h = 0; h < tweetHashtags.length; h++) {
              // Get hashtag text and convert to lowercase and remove ' + "
              var getHashTag = tweetHashtags[h].text.toLowerCase().replace(/"/g, '').replace(/'/g, '');
              // Check if hashtag exist in object
              if (countObject[i].tags[getHashTag]) {
                // Count total hashtag use
                countObject[i].tags[getHashTag]++
              } else {
                // Start counting hashtag
                countObject[i].tags[getHashTag] = 1;
              }
            }
          }
        }
      }
    } else {
      // No country code in Tweet data
    }
  } else {
    // No place is added to Tweet data
  }
});

// User connects to website
sockIO.on('connection', function (socket) {
  // Push the current state of countries data to the connecting client side
  sockIO.to(socket.id).emit('country_code_list', countObject);
  // User request for top hashtags of a country
  socket.on('get_top_hashtags', function (id, code) {
    // loop through country object to find the country of choice
    for(key in countObject){
      // Get selected country
      if (code === countObject[key].code) {
        // Sort most used hashtags
        var sortableTagCount = [];
        // Push hashtags to sorting array
        for (var tagText in countObject[key].tags) {
          sortableTagCount.push([tagText, countObject[key].tags[tagText]]);
        }
        // Most Tweeted Hashtag on top
        sortableTagCount.sort(function(a, b) {
          return b[1] - a[1];
        });
        // Get top 5 hashtags
        var topTags = [];
        for (var s = 0; s < sortableTagCount.length; s++) {
          if (s < 5) {
            // Push to topTags only the first 5
            topTags.push(sortableTagCount[s]);
          }
        }
        // Get country name of selected country
        var countryNameTop = countObject[key].name;
      }
    }
    // Send the user his response for the top t hashtag for his country of choice
    sockIO.to(id).emit('response_top_hashtags', countryNameTop, topTags);
  });

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

module.exports.app = app;
exports.countObject = countObject;
