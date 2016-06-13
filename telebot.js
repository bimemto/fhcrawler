var Crawler = require("crawler");
var url = require('url');
var db = require("./db.js");
var trim = require("trim");

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, result, $) {
        // $ is Cheerio by default
        
    }
});

crawl = function() {
    db.connectDB(function(error, result) {
        if (error) {
            console.log(error);
        }
        else {
            c.queue('http://tv.101vn.com/');
        }
    });
    // Queue just one URL, with default callback

};