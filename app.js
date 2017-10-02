var keys = require('./keys.js');

var Twitter = require("twitter");

var request = require("request");

var Spotify = require("node-spotify-api");

var twitClient = new Twitter(keys.twitterKeys);

var spotClient = new Spotify(keys.spotifyKeys);

var fs = require("fs");

var nodeArgv = process.argv;

var action = process.argv[2];

var title = '';

// for loop to make song/movie titles searchable 

for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        title = title + "+" + nodeArgv[i];
    } else {
        title = title + nodeArgv[i];
    }
}

// switch statement to determine what function app performs

switch (action) {
    case "movie-this":
        if (title) {
            omdb(title);
        } else {
            omdb("Mr.Nobody")
        }
        break;

    case "spotify-this-song":
        if (title) {
            spotifySong(title);
        } else {
            spotifySong("Great balls of fire!");
        }
        break;

    case "my-tweets":
        tweets();
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says");
        break;

}

function omdb(title) {

    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            // console.logs data 
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            // adds text to log.txt
            fs.appendFile('log.txt', "Title: " + body.Title + "\n");
            fs.appendFile('log.txt', "Release Year: " + body.Year + "\n");
            fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating + "\n");
            fs.appendFile('log.txt', "Country: " + body.Country + "\n");
            fs.appendFile('log.txt', "Language: " + body.Language + "\n");
            fs.appendFile('log.txt', "Plot: " + body.Plot + "\n");
            fs.appendFile('log.txt', "Actors: " + body.Actors + "\n");
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating + "\n");
            fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL + "\n");
        } else {
            console.log('error');
        }
    });
};

function spotifySong(song) {
    spotClient.search({
        type: 'track',
        query: song
    }, function(error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                // console.logs data
                console.log("Artist: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

                //adds text to log.txt
                fs.appendFile('log.txt', songData.artists[0].name + "\n");
                fs.appendFile('log.txt', songData.name + "\n");
                fs.appendFile('log.txt', songData.preview_url + "\n");
                fs.appendFile('log.txt', songData.album.name + "\n");
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error occurred.');
        }
    });
};

function tweets() {
    var user = {
        screen_name: 'awey1'
    };
    twitClient.get('statuses/user_timeline', user, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("@awey1: " + tweets[i].text + " Created At: " + tweets[i].created_at.substring(0, 19));
                console.log("-----------------------");
                // adds text to log.txt
                fs.appendFile('log.txt', "@awey1: " + tweets[i].text + " Created At: " + tweets[i].created_at.substring(0, 19) + "\n");

            }
        } else {
            console.log('error');

        }
    });
};
// function to demonstrate fs.readFile 
function doThing() {
    fs.readFile('random.txt', "utf8", function(error, data) {
        var txt = data.split(',');
        spotifySong(txt[1]);
    });
}