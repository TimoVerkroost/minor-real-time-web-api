# Minor Real-Time web with Twitter streams
Real-Time with websockets and Twitter streams. 
The app counts all Tweets in de world (from the time when server starts) and sorts them by country. I used the Twitter streaming API to make this happen.

Tweet counter app: [Live demo](https://twitter-locations.herokuapp.com/)

![Counter screenshot](https://github.com/TimoVerkroost/minor-real-time-web-api/blob/master/repo-images/screenshot_counter.png "Counter screenshot")

## Usedunuseds
* [x] [`Socket.io`](https://www.npmjs.com/package/socket.io) for real-time updates.
* [x] [`Express`](https://github.com/expressjs/express) server.
* [x] [`Handlebars`](https://github.com/pillarjs/hbs) templating.
* [x] [`Compression`](https://www.npmjs.com/package/compression) for gzip.
* [x] [`Twit`](https://www.npmjs.com/package/twit) for Twitter authentication.

## Finished features
* [x] Removed jQuery.
* [x] Twitter streaming API.
* [x] Count on tweet trigger from Twitter steaming API.
* [x] List of all countries and country codes
* [x] Indicate which country tweeted.
* [x] Top tweets country add the top.
* [x] Update top Tweets for each user specific.
* [x] Count number of Tweets in custom JS object.
* [x] Server counts the Tweets the client only asks what the server knows.

## Websocket events
To give the user/client the most up to date information I make use of websockets. To handle the websocket events I used the [`Socket.io`](https://www.npmjs.com/package/socket.io) package.

### Update Tweets for each country
```javascript
  // Serverside emit when a Tweet is posted
  sockIO.emit('country_code_list_count', countObject, totalCount);
  
  // Clientside action when their is an emit
  socket.on('country_code_list_count', function (listCount, totalCount) {
      // Loop through the countries on the client side and update them
  });
```

### First connection of the user
```javascript
  // Serverside emit that user is connected and the give the count data that exist.
  sockIO.on('connection', function (socket) {
    // Send data to user that is connecting
    sockIO.to(socket.id).emit('country_code_list', countObject);
  });
  
  // Clientside action when their is an emit
  socket.on('country_code_list', function (list) {
    // Loop through the countries on the client side to place the data
  });
```

### Get top hashtags for a specific country by user request
```javascript
  // Serverside when request from user to get top hashtags for a country
  socket.on('get_top_hashtags', function (id, code) {
    // Get the right country hashtags 
    // Send the top 5 hashtags to the user that asked for it
    sockIO.to(id).emit('response_top_hashtags', countryNameTop, topTags);
  });
  
  // Clientside asked for hashtags of country
  socket.emit('get_top_hashtags', socket.id, blockID);
  // Response from server for top hashtags of the selected country
  socket.on('response_top_hashtags', function (countryName, topHashtags) {
    // Places the response in the HTML
  });
```

### Error handle when Twitter streaming API fails
```javascript
  // Serverside emit only when an error appears
  // Handle connection error Twitter streaming API and emit to client
  stream.on('error', function (errMsg) {
    sockIO.emit('error_handle', errMsg);
  });
  // Handle disconnect Twitter streaming API and emit to client
  stream.on('disconnect', function (disconnect) {
    sockIO.emit('error_handle', disconnect);
  });
  
  // Clientside show error and remove the counters
  socket.on('error_handle', function () {
    // Show error container and hide unused containers
  });
```

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

## Finished todo's
* [x] Live demo.
* [x] Multiple users with own content.
* [x] UI for country counters + top hashtags per country.
* [x] .env variables are secret.
* [x] Websockets from server to client for continues feedback.
* [x] Streaming API from Twitter to server for continues updates.
* [x] Error handling when Twitter streaming API won't work.
* [x] When a client refresh the page the hash in the URL knows whats country the client was viewing. 

## Wishlist
* [ ] D3.js chart with data of the Twitter stream.
* [ ] Database use instead of counting in JS object.
* [ ] More filters to specify country information.
* [ ] Use own code for authentication instead of Twit package.

## Licence
MIT © Timo Verkroost
