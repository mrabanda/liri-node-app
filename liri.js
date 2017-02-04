const keys = require('./keys.js');
const fs = require('fs');
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');

var twit = new twitter(keys);

var command = process.argv[2];
var argument = process.argv[3];

//Callback prints user tweets
function twitterSearch(err,tweets) {
  if (err) {
    console.log('Error occurred: ' + err);
    return;
  };
  for (let i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }
}

//Callback prints spotify song search results
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

function checkSong() {
	if(argument) {
    song = argument;
  } else {
    song = 'The Sign Ace of Base'
  }
}

//Callback prints movie search results
function omdbSearch(err,response,data) {
  if (err) {
    console.log('Error occurred: ' + err);
    return;
  };
  movieData = JSON.parse(data); //data recieved as text, must convert to JSON before using
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

function checkTitle() {
	if(argument) {
    title = argument;
  } else {
    title = 'Mr. Nobody'
  }
  omdbUrl = 'http://www.omdbapi.com/?t='+ title + '&y=&plot=short&r=json'
}

//Callback that puts data read from file into 2 variables and passes them to leer()
function searchFromFile(err,data) {
  var dataArr = data.replace(/['"]+/g,'').trim().split(',');
  command = dataArr[0];
  argument = dataArr[1];
  leer(command,argument);
}

/* Main function that interprets user commands from terminal:
"my-tweets ['screen name']"
"spotify-this-song ['song title']"
"movie-this ['movie title']"
"do-what-it-says" */
function leer(command,argument) {

  //my-tweets
  if (command === 'my-tweets') {
    twit.get('statuses/user_timeline', {screen_name: argument, count: 20}, twitterSearch)

  //spotify-this-song
  } else if (command === "spotify-this-song") {
  	checkSong();
    spotify.search({ type: 'track', query: song}, spotifySearch);

  //movie-this
  } else if (command === "movie-this") {
    checkTitle();
    request(omdbUrl, omdbSearch)

  //do-what-it-says (run the search from command written in file)
  } else if (command === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', searchFromFile)
  }
}

leer(command,argument);
