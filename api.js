var db = require("./db.js");
var express = require('express');
var app = express();

app.get('/listHighLight', function(req, res) {
    db.getAllHighlight(0, 20, function(err, rows) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            console.log('Ahihi', rows);
            res.json(rows);
        }
    });
})

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})