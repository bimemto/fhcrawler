var Crawler = require("crawler");
var url = require('url');
var db = require("./db.js");
var trim = require("trim");

db.connectDB();

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, result, $) {
        // $ is Cheerio by default
        if($){
            var currentTemp = $('span.nhietdo-big').text();
        }
    }
});

c.queue('http://www.24h.com.vn/ttcb/thoitiet/thoi-tiet-ha-noi');
