var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/mydb';
// Use connect method to connect to the Server
insertLiveMatch = function(team_home, team_away, logo_home, logo_away, time, league, details_url){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

		addMatches(db, function() {
			db.close();
		});
	});
}



var addMatches = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('liveMatch');
  collection.insertMany([
  	{team_home : team_home}, {team_away : team_away}, {logo_home : logo_home}, {logo_away: logo_away}, {time: time}, {league: league}, {details_url: details_url}
  	], function(err, result) {
  		assert.equal(err, null);
  		console.log("Inserted");
  		callback(result);
  	});
}

getMatchList = function(callback) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
		findMatches(db, function() {
			db.close();
		});
	});
}

var findMatches = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('liveMatch');
  // Find some documents
  collection.find({}).toArray(function(err, rows) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(rows);
    callback(rows);
  });
}
// var mysql = require('mysql');

// var db_config = {
// 	host: '103.53.170.173',
// 	user: 'duynk',
// 	password: 'smilelife',
// 	database: 'euro_2016'
// };

// var connection;

// connectDB = function(callback) {
// 	connection = mysql.createConnection(db_config); // Recreate the connection, since
// 	connection.connect(function(error, result){
// 		if(error){
// 			console.log('error when connecting to db:', error);
// 			setTimeout(connectDB, 2000);
// 		} else {
// 			callback(result);	
// 		}
// 	});

// 	connection.on('error', function(err) {
// 		console.log('db error', err);
//     	connectDB();                                 // server variable configures this)
// 	});
// };

// insertHighlight = function(Title, Date, Desc, Thumb, VideoURL1, VideoURL2, VideoURL3) {
// 	var data = {
// 		Title: Title,
// 		Date: Date,
// 		Desc: Desc,
// 		Thumb: Thumb,
// 		VideoURL1: VideoURL1,
// 		VideoURL2: VideoURL2,
// 		VideoURL3: VideoURL3,
// 		TimeAdded: getDateTime()
// 	};
// 	connection.query("SELECT * From highlight WHERE Title='" + Title + "'", function(err, res) {
// 		if (res.length === 0) {
// 			connection.query('INSERT INTO highlight SET ?', data, function(err, res) {
// 				if (err) throw err;
// 				else {
// 					console.log('A new entity has been added.');
// 				}
// 			});
// 		}
// 	});
// };

// insertPokemon = function(id, name, image, type, generation) {
// 	var data = {
// 		id: id,
// 		name: name,
// 		image: image,
// 		type: type,
// 		generation: generation
// 	};
// 	connection.query("SELECT * FROM Pokedeck WHERE id='" + id + "'", function(err, res) {
// 		if (res.length === 0) {
// 			connection.query('INSERT INTO Pokedeck SET ?', data, function(err, res) {
// 				if (err){
// 					console.log(err);
// 				} else {
// 					console.log('A new entity has been added.');
// 				}
// 			});
// 		}
// 	});
// };

// getAllPokemon = function(callback) {
// 	connection.query("SELECT * FROM Pokedeck WHERE generation = 1", function(err, rows) {
// 		callback(err, rows);
// 	});
// };

// insertLiveMatch = function(team_home, team_away, logo_home, logo_away, time, league, details_url, live_stream_url) {
// 	var data = {
// 		team_home: team_home,
// 		team_away: team_away,
// 		logo_home: logo_home,
// 		logo_away: logo_away,
// 		time: time,
// 		league: league,
// 		details_url: details_url,
// 		live_stream_url: live_stream_url
// 	};
// 	connection.query("DELETE From live_stream", function(err, res) {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			connection.query('INSERT INTO live_stream SET ?', data, function(err, res) {
// 				if (err){
// 					console.log(err);
// 				}
// 				else {
// 					console.log('A new entity has been added.');
// 				}
// 			});
// 		}
// 	});
// };

// checkExist = function(title, callback) {
// 	connection.query("SELECT * From highlight WHERE Title='" + title + "'", function(err, res) {
// 		callback(res.length);
// 	});
// };

// getAllHighlight = function(offset, limit, callback) {
// 	connection.query("SELECT * From highlight WHERE TimeAdded >= NOW() - INTERVAL 2 DAY LIMIT " + limit + " OFFSET " + offset, function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getAllVideos = function(offset, limit, callback) {
// 	connection.query("SELECT * From highlight LIMIT " + limit + " OFFSET " + offset, function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getMatchList = function(callback) {
// 	connection.query("SELECT * From live_stream", function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getHighLightByTeam = function(team, callback) {
// 	connection.query("SELECT * From highlight WHERE TimeAdded >= NOW() - INTERVAL 2 DAY AND Title LIKE " + "'%" + team + "%'", function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getPesFund = function(daysAgo, callback) {
// 	var query;
// 	if(daysAgo === 0){
// 		query = "SELECT * FROM PesFund ORDER BY STT DESC";
// 	} else {
// 		query = "SELECT * From PesFund ORDER BY STT DESC LIMIT " + daysAgo;
// 	}
// 	connection.query(query, function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getSentence1 = function(callback) {
// 	var query = "SELECT * FROM DanhNgon WHERE id = 6";
// 	connection.query(query, function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// getSentence2 = function(callback) {
// 	var query = "SELECT * FROM DanhNgon WHERE id = 4";
// 	connection.query(query, function(err, rows) {
// 		callback(err, rows);
// 	});
// }

// closeDB = function() {
// 	connection.end();
// };

// function getDateTime() {

// 	var date = new Date();

// 	var year = date.getFullYear();

// 	var month = date.getMonth() + 1;
// 	month = (month < 10 ? "0" : "") + month;

// 	var day  = date.getDate();
// 	day = (day < 10 ? "0" : "") + day;

// 	return year + "-" + month + "-" + day;

// }

// module.exports.connectDB = connectDB;
// module.exports.insertHighlight = insertHighlight;
module.exports.insertLiveMatch = insertLiveMatch;
// module.exports.closeDB = closeDB;
// module.exports.checkExist = checkExist;
// module.exports.getAllHighlight = getAllHighlight;
// module.exports.getAllVideos = getAllVideos;
module.exports.getMatchList = getMatchList;
// module.exports.getHighLightByTeam = getHighLightByTeam;
// module.exports.getPesFund = getPesFund;
// module.exports.getSentence1 = getSentence1;
// module.exports.getSentence2 = getSentence2;
// module.exports.insertPokemon = insertPokemon;
// module.exports.getAllPokemon = getAllPokemon;