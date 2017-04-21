# Minor Real-Time web with Twitter streams
Real-Time with websockets and Twitter streams. 
The app counts all Tweets in de world (from the time when server starts) and sorts them by country. I used the Twitter streaming API to make this happen.

Tweet counter app: [Live demo](https://twitter-locations.herokuapp.com/)

![Counter screenshot](https://github.com/TimoVerkroost/minor-real-time-web-api/blob/master/repo-images/screenshot_counter.png "Counter screenshot")


## Used packages
* [x] Socket.io for real-time updates.
* [x] Express server.
* [x] Compression for gzip.
* [x] Handlebars for templating.
* [x] Twit for Twitter authentication.

## Finished features
* [x] Removed jQuery.
* [x] Twitter streaming API.
* [x] Count on tweet trigger from Twitter steaming API.
* [x] List of all countries and country codes
* [x] Indicate which country tweeted.
* [x] Top tweet country add the top.

## Wishlist
* [ ] D3.js chart with data of the Twitter stream.
* [ ] Database use instead of JS count.
* [ ] More filters.
* [ ] Use own code for authentication instead of Twit package.

## Build / Install and start project

### Clone this repo

```
  git clone https://github.com/TimoVerkroost/minor-real-time-web-api
  cd minor-real-time-web-api
```

### Install the dependencies
```
npm install
```

### Environment setup (.env file)
```
TWITTER_CONSUMER_KEY=YourCostumerKey1337
TWITTER_CONSUMER_SECRET=YourCostumerSecret1337
TWITTER_ACCESS_TOKEN=YourAccessToken1337
TWITTER_TOKEN_SECRET=YourAccessSecret1337
```

### Build CSS and JS
This will build the minified and cleaned CSS and JavaScript files.
```
npm run build
```

### Start server
```
npm start
```

### Start server with live updates
```
npm run start-update
```

### Watch changes
```
npm run watch
```

## Licence
MIT © Timo Verkroost
