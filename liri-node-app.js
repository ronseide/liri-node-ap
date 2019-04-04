require("dotenv").config();
var fs = require("fs");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var keys = require("./keys.js");
// Spotify Function
function spotifyThis() {
  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });
  if (process.argv[3] === undefined) {
    var spotifySearchTerm = "The+Sign";
  }
  else
    var spotifySearchTerm = process.argv[3];
  for (i = 4; i < process.argv.length; i++) {
    spotifySearchTerm += " " + process.argv[i];
  }
  spotifySearchTerm = encodeURI(spotifySearchTerm);
  spotify.search({ type: 'track', query: spotifySearchTerm, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("\nThe name of the song is: " + data.tracks.items[0].name + "\nThe album this song is from is: " + data.tracks.items[0].album.name + "\nThe song's artist is: " + data.tracks.items[0].album.artists[0].name + "\nClick the link for a preview of the song: " + data.tracks.items[0].preview_url + "\n");

  });
}
// // OMBD Function
function movieThis() {
  var omdbApiKey = keys.ombd.key;
  if (process.argv[3] === undefined) {
    var omdbSearchTerm = "Mr.+Nobody";
  }
  else
    var omdbSearchTerm = process.argv[3];
  for (i = 4; i < process.argv.length; i++) {
    omdbSearchTerm += " " + process.argv[i];
  }
  omdbSearchTerm = encodeURI(omdbSearchTerm);
  console.log(omdbSearchTerm);
  axios.get("http://www.omdbapi.com/?apikey=" + omdbApiKey + "&t=" + omdbSearchTerm
  )
    .then(function (response) {
      console.log("\nThe movie title is: " + response.data.Title + '\n' + "The release date for this movie is: " + response.data.Year + '\n' + "The IMDB rating for this movie is: " + response.data.imdbRating + '\n' + "The Metascore rating for this movie is: " + response.data.Metascore + '\n' + "This movie was produced in: " + response.data.Country + '\n' + "The language of this movie is: " + response.data.Language + '\n' + "The plot of this movie is: " + response.data.Plot + '\n' + "The cast of this movie includes: " + response.data.Actors + "\n");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// Bands in Town Function
function bandsInTownThis() {
  var bandsInTownApiKey = keys.bandsInTown.key;
  var bandsInTownSearchTerm = process.argv[3];
  for (i = 4; i < process.argv.length; i++) {
    bandsInTownSearchTerm += " " + process.argv[i];
  }
  bandsInTownSearchTerm = encodeURI(bandsInTownSearchTerm);
  axios.get(
    "https://rest.bandsintown.com/artists/" + bandsInTownSearchTerm + "/events?app_id=" + bandsInTownApiKey)
    .then(function (response) {
      console.log("\nThe concert venue is: " + response.data[0].venue.name + "\nThe concert location is: " + response.data[0].venue.city + "\nThe concert date is: " + response.data[0].datetime + "\n");
    })
    .catch(function (error) {
      console.log(error);
    });
}
function doWhatItSaysThis() {
  fs.readFile("./random.txt", "utf8", function (error, data) {
    var dataArray = data.split(",")
    process.argv[2] = dataArray[0];
    process.argv[3] = dataArray[1];
    selectThis ();
  })
}
function selectThis() {
  if (process.argv[2] === "concert-this") {
    bandsInTownThis();
  }
  if (process.argv[2] === "movie-this") {
    movieThis();
  }
  if (process.argv[2] === "spotify-this-song") {
    spotifyThis();
  }
  if (process.argv[2] === "do-what-it-says") {
    doWhatItSaysThis()
  }
}
selectThis ();