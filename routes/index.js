var express = require('express');
var router = express.Router();
var Twit = require('twit');
require('dotenv').config();

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

// var locationsTrack = {
//   NewYork: '-74,40,-73,41',
//   SanFrancisco: '-122.75,36.8,-121.75,37.8',
//   Amsterdam: '52.370216,4.895168',
//   Osaka: '34.693738,135.502165',
//   Delhi: '28.704059,77.102490',
//   Seoul: '37.566535,126.977969',
//   SaoPaulo: '-23.550520,-46.633309',
//    unknown: ['-180', '-90', '180' ,'90']
// };

// var locationsTrack = {
//   NewYork: ['-74', '40', '-73', '41'],
//   SanFrancisco: ['-122.75', '36.8', '-121.75', '37.8'],
//   Netherlands: ['3', '51', '8', '54']
// };
//
//
// Object.keys(locationsTrack).forEach(function(key) {
//   var location = locationsTrack[key];
//   var stream = twitter.stream('statuses/filter', { locations: location });
//   var count = 0;
//   stream.on('tweet', function (tweet) {
//     count++;
//     console.log(tweet);
//     console.log(key + ": " + count);
//   });
//
// });

// var stream_sanfrancisco = twitter.stream('statuses/filter', { locations: locationsTrack.sanfrancisco });
// var count_sanfrancisco = 0;
// stream_sanfrancisco.on('tweet', function (tweet) {
//   console.log(tweet);
//   count_sanfrancisco++;
//   console.log(count_sanfrancisco);
// });
//
// var stream_amsterdam = twitter.stream('statuses/filter', { locations: locationsTrack.amsterdam });
// var count_amsterdam = 0;
// stream_amsterdam.on('tweet', function (tweet) {
//   console.log(tweet);
//   count_amsterdam++;
//   console.log(count_amsterdam);
// });
//
// var stream_newyork = twitter.stream('statuses/filter', { locations: locationsTrack.newyork });
// var count_newyork= 0;
// stream_newyork.on('tweet', function (tweet) {
//   console.log(tweet);
//   count_newyork++;
//   console.log(count_newyork);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  // var locationsTrack = {
  //   NewYork: ['-74', '40', '-73', '41'],
  //   SanFrancisco: ['-122.75', '36.8', '-121.75', '37.8'],
  //   Netherlands: ['3', '51', '8', '54']
  // };

  // Object.keys(locationsTrack).forEach(function(key) {
  //   var location = locationsTrack[key];
  //   var stream = twitter.stream('statuses/filter', { locations: location });
  //   var count = 0;
  //   stream.on('tweet', function (tweet) {
  //     count++;
  //     console.log(key + " - " + tweet.lang + ": " + count);
  //   });
  //
  // });

  // var locationsTrack = {
  //   globe: ['-180', '-90', '180' ,'90']
  // };
  //
  // var location = locationsTrack[key];
  var stream = twitter.stream('statuses/filter', { track: 'Sun' });
  console.log(stream);
  var count = 0;
  stream.on('tweet', function (tweet) {
    count++;
    console.log(tweet.lang + " - Sun: " + count);
  });

  res.render('index', { title: 'Express'});
});

module.exports = router;
