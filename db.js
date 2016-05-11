var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '103.53.170.173',
	user: 'duynk',
	password: 'smilelife',
	database: 'euro_2016'
});

//var insertRecord = 'INSERT INTO highlight(Title,Date,Desc,Thumb,VideoURL1,VideoURL2,VideoURL3) VALUE(?,?,?,?,?,?,?)';

//var readTable = 'SELECT * FROM highlight';

//var deleteRecord = 'DELETE FROM highlight WHERE title=?';

connectDB = function() {
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});
};

insertHighlight = function(Title, Date, Desc, Thumb, VideoURL1, VideoURL2, VideoURL3) {
	var data = {
		Title: Title,
		Date: Date,
		Desc: Desc,
		Thumb: Thumb,
		VideoURL1: VideoURL1,
		VideoURL2: VideoURL2,
		VideoURL3: VideoURL3
	};
	connection.query("SELECT * From highlight WHERE Title='" + Title + "'", function(err, res) {
		if (res.length === 0) {
			connection.query('INSERT INTO highlight SET ?', data, function(err, res) {
				if (err) throw err;
				else {
					console.log('A new entity has been added.');
				}
			});
		}
	});
};

checkExist = function(title, callback) {
	connection.query("SELECT * From highlight WHERE Title='" + title + "'", function(err, res) {
		callback(res.length);
	});
};

getAllHighlight = function(offset, limit, callback) {
	connection.query("SELECT * From highlight LIMIT " + limit + " OFFSET " + offset, function(err, rows) {
		callback(err, rows);
	});
}

getHighLightByTeam = function(team, callback) {
	connection.query("SELECT * From highlight WHERE Title LIKE " + "'%" + team + "%'", function(err, rows) {
		callback(err, rows);
	});
}

closeDB = function() {
	connection.end();
};

module.exports.connectDB = connectDB;
module.exports.insertHighlight = insertHighlight;
module.exports.closeDB = closeDB;
module.exports.checkExist = checkExist;
module.exports.getAllHighlight = getAllHighlight;
module.exports.getHighLightByTeam = getHighLightByTeam;