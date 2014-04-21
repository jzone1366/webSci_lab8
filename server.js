var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	port = 8080;

server.listen(port, function(){
	console.log("Listening on " + port);
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

var i = 0, numTweets = 2000;
var langs = [0, 0, 0, 0, 0];
var hashtags = [0, 0];
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
		if(i % 20 == 0 ){
			console.log(i);
		}
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
		}
	});
});	

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
	//[yes, no]
	if(hashes[0] != null) {
		hashtags[0]++;
	}
	else{
		hashtags[1]++;
	}
}


//ROUTES
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get("/getLangObject", function(req, res){
	res.json(langs);
	console.log("Lang Get Request Successful");
});

app.get("/getHashObject", function(req, res){
	res.json(hashtags);
	console.log("Hash Get Request Succssful");
});

app.use('/resources', express.static(__dirname + '/resources'));