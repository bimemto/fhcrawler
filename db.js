var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/mydb';
// Use connect method to connect to the Server
insertLiveMatch = function(team_home, team_away, logo_home, logo_away, time, league, details_url){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
		addMatches(db, team_home, team_away, logo_home, logo_away, time, league, details_url, function() {
      db.close();
    });
	});
}

clearMatches = function(callback){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		deleteAllMatches(db, function(result){
			console.log("Cleared");
			callback(result);
			db.close();
		});
	});
}

var addMatches = function(db, team_home, team_away, logo_home, logo_away, time, league, details_url, callback) {
  // Get the documents collection
  var collection = db.collection('liveMatch');
  var data = {
  	team_home: team_home,
  	team_away: team_away,
  	logo_home: logo_home,
  	logo_away: logo_away,
  	time: time,
  	league: league,
  	details_url: details_url
  };
  collection.insert([
  	data
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
		findMatches(db, function(rows) {
			callback(rows);
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

var deleteAllMatches = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('liveMatch');
  // Insert some documents
  collection.remove({}, function(err, result) {
  	assert.equal(err, null);
  	console.log("Removed");
  	callback(result);
  });
}

var addPokemon = function(db, id, name, maxCP, callback){
  var collection = db.collection('pokemon');
  var data = {
    id: id,
    name: name,
    maxCP: maxCP
  };
  collection.insert([
    data
    ], function(err, result) {
      assert.equal(err, null);
      console.log("Inserted");
      callback(result);
    });
}

var addPokeStats = function(db, id, image, baseAtk, baseDef, baseSta, captureRate, fleeRate, type, candy, hatchDistance, callback){
  var collection = db.collection('pokestats');
  var data = {
    id: id,
    image: image,
    baseAtk: baseAtk,
    baseDef: baseDef,
    baseSta: baseSta,
    captureRate: captureRate,
    fleeRate: fleeRate,
    type: type,
    candy: candy,
    hatchDistance: hatchDistance
  };
  collection.insert([
    data
    ], function(err, result) {
      assert.equal(err, null);
      console.log("Inserted");
      callback(result);
    });
}

insertPokemon = function(id, name, maxCP){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    addPokemon(db, id, name, maxCP, function() {
      db.close();
    });
  });
}

var findPokemonById = function(db, id, callback){
  var cursor = db.collection('pokemon').find( { "id": id } );
  cursor.each(function(err, result) {
    assert.equal(err, null);
    if (result != null) {
     console.dir(result);
     callback(result);
   } else {
     callback(err);
   }
 });
}

insertPokeStats = function(id, image, baseAtk, baseDef, baseSta, captureRate, fleeRate, type, candy, hatchDistance){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    addPokeStats(db, id, image, baseAtk, baseDef, baseSta, captureRate, fleeRate, type, candy, hatchDistance, function(){
      db.close();
    });
  });
}

var addPokeCP = function(db, id, stardust, level, minCP, maxCP, callback){
  var collection = db.collection('pokecp');
  var data = {
    id: id,
    stardust: stardust,
    level: level,
    minCP: minCP,
    maxCP: maxCP
  };
  collection.insert([
    data
    ], function(err, result) {
      assert.equal(err, null);
      console.log("Inserted");
      callback(result);
    });
}

insertPokeCP = function(id, stardust, level, minCP, maxCP){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    addPokeCP(db, id, stardust, level, minCP, maxCP, function(){
      db.close();
    });
  });
}

var getAllPokemons = function(db, callback) {
  var collection = db.collection('pokemon');
  collection.find({}).toArray(function(err, rows) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(rows);
    callback(rows);
  });
}

getPokemonList = function(callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    getAllPokemons(db, function(rows) {
      callback(rows);
      db.close();
    });
  });
}

var getStats = function(pokeId, db, callback){
  var collection = db.collection('pokestats');
  collection.findOne({"id": pokeId}, function(err, rows) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(rows);
    callback(rows);
  });
}

getPokeStats = function(id, callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    getStats(id, db, function(rows) {
      callback(rows);
      db.close();
    });
  });
}

var getCPs = function(pokeId, db, callback){
  var collection = db.collection('pokecp');
  collection.find({"id": pokeId}).toArray(function(err, rows) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(rows);
    callback(rows);
  });
}

getPokeCPs = function(id, callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    getCPs(id, db, function(rows) {
      callback(rows);
      db.close();
    });
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
module.exports.clearMatches = clearMatches;
// module.exports.getHighLightByTeam = getHighLightByTeam;
// module.exports.getPesFund = getPesFund;
// module.exports.getSentence1 = getSentence1;
// module.exports.getSentence2 = getSentence2;
module.exports.getPokeCPs = getPokeCPs;
module.exports.getPokeStats = getPokeStats;
module.exports.insertPokemon = insertPokemon;
module.exports.insertPokeStats = insertPokeStats;
module.exports.insertPokeCP = insertPokeCP;
module.exports.getPokemonList = getPokemonList;