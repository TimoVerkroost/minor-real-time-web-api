# Minor Real-Time web with Twitter streams
Real-Time with websockets and Twitter streams.

Chat app: [Live demo](https://twitter-locations.herokuapp.com/)

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

## Wishlist
* [ ] D3 chart with data of the Twitter stream.

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
