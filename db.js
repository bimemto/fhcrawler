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

connectDB = function(callback) {
	connection.connect(function(error, result){
		callback(error, result);
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
		VideoURL3: VideoURL3,
		TimeAdded: getDateTime()
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
	connection.query("SELECT * From highlight WHERE TimeAdded >= NOW() - INTERVAL 2 DAY LIMIT " + limit + " OFFSET " + offset, function(err, rows) {
		callback(err, rows);
	});
}

getAllVideos = function(offset, limit, callback) {
	connection.query("SELECT * From highlight LIMIT " + limit + " OFFSET " + offset, function(err, rows) {
		callback(err, rows);
	});
}

getHighLightByTeam = function(team, callback) {
	connection.query("SELECT * From highlight WHERE TimeAdded >= NOW() - INTERVAL 2 DAY AND Title LIKE " + "'%" + team + "%'", function(err, rows) {
		callback(err, rows);
	});
}

getPesFund = function(daysAgo, callback) {
	var query;
	if(daysAgo === 0){
		query = "SELECT * FROM PesFund ORDER BY STT DESC";
	} else {
		query = "SELECT * From PesFund ORDER BY STT DESC LIMIT " + daysAgo;
	}
	connection.query(query, function(err, rows) {
		callback(err, rows);
	});
}

getSentence1 = function(callback) {
	var query = "SELECT * FROM DanhNgon WHERE id = 6";
	connection.query(query, function(err, rows) {
		callback(err, rows);
	});
}

getSentence2 = function(callback) {
	var query = "SELECT * FROM DanhNgon WHERE id = 4";
	connection.query(query, function(err, rows) {
		callback(err, rows);
	});
}

closeDB = function() {
	connection.end();
};

function getDateTime() {

	var date = new Date();

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return year + "-" + month + "-" + day;

}

module.exports.connectDB = connectDB;
module.exports.insertHighlight = insertHighlight;
module.exports.closeDB = closeDB;
module.exports.checkExist = checkExist;
module.exports.getAllHighlight = getAllHighlight;
module.exports.getAllVideos = getAllVideos;
module.exports.getHighLightByTeam = getHighLightByTeam;
module.exports.getPesFund = getPesFund;
module.exports.getSentence1 = getSentence1;
module.exports.getSentence2 = getSentence2;