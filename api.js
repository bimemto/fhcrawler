var db = require("./db.js");
var express = require('express');
var app = express();

app.get('/euro/api/videos', function(req, res) {
    db.getAllVideos(req.query.offset, req.query.limit, function(err, rows) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                var videoUrl2 = rows[i].VideoURL2;
                var videoUrl3 = rows[i].VideoURL3;
                if (videoUrl2 === null || videoUrl2 === 'null') {
                    videoUrl2 = "";
                }
                if (videoUrl3 === 'null' || videoUrl3 === null) {
                    videoUrl3 = "";
                }
                data[i] = {title: rows[i].Title, thumb: rows[i].Thumb, date: rows[i].Date, desc: rows[i].Desc, video1: rows[i].VideoURL1, video2: videoUrl2, video3: videoUrl3};
            }
            res.send(data);
        }
    });
})

var server = app.listen(8080, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})