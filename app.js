const express = require('express');
const axios = require('axios');
const geohash = require('ngeohash');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.static('dist/findevents'));

const ticketApikey = "6olTwk53PSX5z3tFfeTsfcxY6RtTDeCS";
const spotifyCliendId = "e5ae966148b14ea7b75a3d432f09c5d4";
const spotifyClientSecret = "bdafc68a2eaa4ebd9053cbe0b2aaab64";


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


app.get('/events', (req, res) => {
  let geohashResult = geohash.encode(req.query.latitude, req.query.longitude, precision=7)
  ticketmasterBaseUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketApikey}&sort=date,asc`
  ticketmasterBaseUrl += "&geoPoint=" + geohashResult
  ticketmasterBaseUrl += "&radius=" + req.query.distance
  catSegDict = {"Music": "KZFzniwnSyZfZ7v7nJ", "Sports": "KZFzniwnSyZfZ7v7nE",
                    "ArtsTheatre": "KZFzniwnSyZfZ7v7na", "Film": "KZFzniwnSyZfZ7v7nn",
                    "Miscellaneous": "KZFzniwnSyZfZ7v7n1"};
  if(req.query.category in catSegDict)
      ticketmasterBaseUrl += `&segmentId=${catSegDict[req.query.category]}`;

  ticketmasterBaseUrl += "&unit=miles"
  ticketmasterBaseUrl += "&keyword=" + req.query.keyword
  axios.get(ticketmasterBaseUrl).then(response => {
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data));
  })
});


app.get('/autocomplete', (req, res) => {
  axios.get(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=${ticketApikey}&keyword=${req.query.keyword}`)
  .then(response => {
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data._embedded));
  })
});


app.get('/artist', (req, res) => {
  let spotifyApi = new SpotifyWebApi({
    clientId: spotifyCliendId,
    clientSecret: spotifyClientSecret
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi = new SpotifyWebApi({
        accessToken: data.body['access_token']
      });
      spotifyApi.searchArtists(req.query['artist']).then(
        function(data) {
          res.header("Access-Control-Allow-Origin","*");
          res.send(JSON.stringify(data.body));
        }
      );
    }
  );
});


app.get('/albums', (req, res) => {
  let spotifyApi = new SpotifyWebApi({
    clientId: spotifyCliendId,
    clientSecret: spotifyClientSecret
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi = new SpotifyWebApi({
        accessToken: data.body['access_token']
      });
      spotifyApi.getArtistAlbums(req.query['artistId'], { limit: 3}).then(
        function(data) {
          res.header("Access-Control-Allow-Origin","*");
          res.send(JSON.stringify(data.body));
        }
      );
    }
  );
});

app.get('/venueDetail', (req, res) => {
  axios.get(`https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${ticketApikey}&keyword=${req.query.keyword}`)
  .then(response => {
    res.header("Access-Control-Allow-Origin","*");
    if(response.data.hasOwnProperty("_embedded")){
      res.send(JSON.stringify(response.data._embedded));
    }
    else{
      let emptyRes = {}
      res.send(JSON.stringify(emptyRes));
    }
  })
});


app.get('*', function(req, res) {
  res.sendFile('frontend/index.html');
});
