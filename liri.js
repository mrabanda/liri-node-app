const keys = require('./keys.js');
const fs = require('fs');
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');

var twit = new twitter(keys);

var command = process.argv[2];
var argument = process.argv[3];

function twitterSearch(err,data) {
  if (err) {
      console.log('Error occurred: ' + err);
      return;
  };
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].text);
  }
}

function spotifySearch(err,data) {
  if (err) {
      console.log('Error occurred: ' + err);
      return;
  };
  var trackInfo = data.tracks.items[0];
  var artistName = trackInfo.artists[0].name;
  var songName = trackInfo.name;
  var songPreview = trackInfo.preview_url;
  var songAlbum = trackInfo.album.name;

  console.log('Artist Name: ' + artistName);
  console.log('Song Name: ' + songName);
  console.log('Link: ' + songPreview);
  console.log('Album: ' + songAlbum);
}

function titleConvert() {
  if(process.argv[4]) {
    let titleArr = [];
    for (let i = 3; i < process.argv.length; i++) {
      titleArr.push(process.argv[i])
    };
    title = titleArr.join('+');
  } else {
    title = argument;
  }
}

function omdbSearch(err,response,data) {
  if (err) {
      console.log('Error occurred: ' + err);
      return;
  };
  movieData = JSON.parse(data);
  movieTitle = movieData.Title;
  movieYear = movieData.Year;
  movieRating = movieData.imdbRating;
  movieCountry = movieData.Country;
  movieLang = movieData.Language;
  moviePlot = movieData.Plot;
  movieActors = movieData.Actors;

  console.log('Movie Title: ' + movieTitle);
  console.log('Year: ' + movieYear)
  console.log('Rating: ' + movieRating)
  console.log('Country: ' + movieCountry)
  console.log('Language: ' + movieLang)
  console.log('Plot: ' + moviePlot)
  console.log('Actors: ' + movieActors)
}

function searchFromFile(err,data) {
  var dataArr = data.split(',');
  command = dataArr[0];
  argument = dataArr[1];
  leer(command,argument);
}

function leer(command,argument) {
  //TWITTER CASE
  if (command === 'my-tweets') {
    twit.get('statuses/user_timeline', {screen_name: argument, count: 20}, twitterSearch)

  //SPOTIFY CASE
  } else if (command === "spotify-this-song") {
    if(argument) {
      song = argument;
    } else {
      song = 'The Sign Ace of Base'
    }
    spotify.search({ type: 'track', query: song}, spotifySearch);
  // OMDB CASE
  } else if (command === "movie-this") {
    if(argument)
      titleConvert()
    else {
      title = 'Mr. Nobody'
    }
    omdbUrl = 'http://www.omdbapi.com/?t='+ title + '&y=&plot=short&r=json'
    request(omdbUrl, omdbSearch)

  //TXT FILE CASE
  } else if (command === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', searchFromFile)
  }
}

leer(command,argument);
