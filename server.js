var express = require('express'),
	fs = require('fs'),
	json2csv = require('json2csv'),
	io = require('socket.io'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	port = 8080;

server.listen(port, function(){
	console.log("Listening on " + port);
});

io = io.listen(server);
io.sockets.on('connection', function(socket){
	console.log('Connected');

	socket.on('getTweets', function(){
		/**
		 * Check if the named file exists. If it does emit an event to notify the client of the existence to display a message to the user. 
		 * @param  boolean exists True if the file exists. False otherwise.
		 */
		fs.exists('ITWS4200-lab7-zonej-tweets.json', function(exists){
			
			if(exists){
				console.log("File is being overwritten!");
				socket.emit("tweetOver"); //Emit an event to the client of this socket for the client to display an alert based on this event. 
				tweets2json(); //call this function to gather the tweets
			}
			
			else{
				tweets2json();
				socket.emit("tweetSuccess");
			}
		});
	});

	socket.on('getCsv', function(){
		/**
		 * Check if the file exists to export. If the json file does not exists then a warning is displayed client side telling the user to create it first
		 * @param  boolean exists True if exists, False otherwise.
		 */
		fs.exists('ITWS4200-lab8-zonej-tweets.json', function(exists){
			
			if(exists){
				socket.emit("csvSuccess");
				tweet2csv();
			}

			else {
				socket.emit("jsonNotExist");
			}
		});
	});

	/**
	 * Connect to the mongoDB collection of tweets and send them to the client to display on the page.
	 * This is done by grabbing the collection as a whole into an array and sending the array to the client. 
	 * @return array of tweet objects. 
	 */
	socket.on('displayTweets', function(){
		MongoClient.connect("mongodb://localhost:27017/tweetDB", function(err, db){
			if(err){
				return console.dir(err);
			}
			db.collection('tweets').find().toArray(function(err, items){
				socket.emit('tweetReturn', items);
			});
		});
	});

	socket.on('disconnect', function(){
		console.log('Disconnected');
	});		
});

//MONGODB Connection
var MongoClient = require('mongodb').MongoClient;
var tweets;
MongoClient.connect('mongodb://127.0.0.1:27017/tweetDB', function(err, db){
	if(err){
		console.log(err);
	} else {
		console.log('Mongo Connection Successful');
		db.createCollection('tweets', {strict: true}, function(err, collection){
			if(err){
				db.collection('tweets').drop(function(err, reply){
					if(err) console.log(err);
					else if(reply = true){
						tweets = db.collection('tweets');
					}
				});
			}
			else{
				tweets = collection;
			}
		});
	}
});

var twitter = require('ntwitter');
var twit = new twitter({
	consumer_key: '5UMbMiZmyfmZIv4w4wIvA',
	consumer_secret: '4XbLRKae0JnngpHyvgXm1K0dnmHYjKGwsZhHrfychy0',
	access_token_key: '110624472-7wxnUD6uIdDYnwLAEIucjtVe1jn6oMWgwd4Oytmp',
	access_token_secret: 'wfgF941yxA0xt2eg6QPUPpI2p5KBCJY3j9OOhir3gsFHF'
});

var i = 0, numTweets = 2000, j=0, time = 1;
var langs = [0, 0, 0, 0, 0];
var hashtags = [0, 0];
var timeline = {};
timeline[0] = 0;
twit.stream('statuses/sample', function(stream){
	stream.on('error', function(error, code){
		console.log("error: " + error + ":" + code);
	});
	stream.on('end', function(response){
		console.log('Stream ended');
	});
	stream.on('destroy', function(response){
		console.log("Stream Destroyed");
	});
	stream.on('data', function(data){
		/*if(i % 20 == 0 ){
			console.log(i);
		}*/
		j++;
		if(i < numTweets){
			i++;
			tweets.insert(data, function(err){
				if(err){
					console.dir(error);
				}
			});
		}
		else if(i == numTweets){
			i++;
			tweets.find().toArray(function(err, docs){
					docs.forEach(function(doc){
						setLang(doc.lang);
						checkHashes(doc.entities.hashtags);
					});
					console.log(langs);
					console.log(hashtags);
			});
		} else {
			i++;
		}
	});
});	

setInterval(setTimeline, 10000);

function setLang(lang){
	//[en, ja, es, pt, other]
	if(lang == "en"){
		langs[0]++;
	}
	else if(lang == "ja"){
		langs[1]++;
	}
	else if(lang == "es"){
		langs[2]++;
	}
	else if(lang =="pt"){
		langs[3]++;
	}
	else{
		langs[4]++;
	}
}

function checkHashes(hashes){
	//[contains hashtags, doesn't contain hashtags]
	if(hashes[0] != null) {
		hashtags[0]++;
	}
	else{
		hashtags[1]++;
	}
}

function setTimeline(){
	timeline[time] = j;
	time++;
	console.log(timeline);
	j=0;
}

/**
 * Connect to the MongoDB database to pull all the tweets in the collection and save them to a temp array.
 * Write the array to a JSON file. 
 * @return {[type]} [description]
 */
function tweets2json() {
	console.log("Writing Tweets to JSON");
	var tempArr = [];
	tweets.find().toArray(function(err, docs){
		docs.forEach(function(doc){
			tempArr.push(doc);
		});
		fs.writeFile('ITWS4200-lab8-zonej-tweets.json', JSON.stringify(tempArr, null, 4), function(err){
			if(err) throw err;
			console.log("Tweets saved to file!");
		});	
	});
}


/**
 * Take the json file that is created by the tweets2JSON function and exports certain fields to a csv file with the same name. This function uses the json2csv module of node. 
 * This file first reads the json file into a string that can be parsed. The columns and column names are passed in as parameters to the json2csv module. 
 * Writes a tweet csv file if there are no errors. Otherwise log the error. 
 * @return ITWS4200-lab8-zonej-tweets.csv
 */
function tweet2csv() {
	console.log("Converting to CSV.");
	var data = fs.readFileSync('ITWS4200-lab8-zonej-tweets.json').toString();
	var json = JSON.parse(data);
	var columns = ['created_at', 'id', 'text', 'user.id', 'user.name', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 
		'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
		
	var col_names = ['created_at', 'id','text', 'user_id', 'user_name', 'user_screen_name', 'user_location', 'user_followers_count', 'user_friends_count', 
		'user_created_at', 'user_time_zone', 'user_profile_background_color', 'user_profile_image_url', 'geo', 'coordinates', 'place'];

	json2csv({data: json, fields: columns, fieldNames: col_names}, function(err, csv){
		if(err) console.log(err);
		fs.writeFile('ITWS4200-lab8-zonej-tweets.csv', csv, function(err){
			if(err) throw err;
			console.log('file saved');
		});
	});
}


//ROUTES
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get("/timeViz.html", function(req, res){
	res.sendfile(__dirname + '/timeViz.html');
});

app.get("/langViz.html", function(req, res){
	res.sendfile(__dirname + '/langViz.html');
});

app.get("/hashViz.html", function(req, res){
	res.sendfile(__dirname + '/hashViz.html');
});

app.get("/getLangObject", function(req, res){
	res.json(langs);
	console.log("Lang Get Request Successful");
});

app.get("/getHashObject", function(req, res){
	res.json(hashtags);
	console.log("Hash Get Request Successful");
});

app.get("/getTimelineObject", function(req, res){
	res.json(timeline);
	console.log("Get Timeline Request Successful");
});

app.use('/resources', express.static(__dirname + '/resources'));