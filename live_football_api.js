var db = require("./db.js");
var express = require('express');
var app = express();
var Crawler = require("crawler");
var liveCrawler = require("./live_football.js");

app.get('/euro/api/match_list', function(req, res) {
    db.getMatchList(function(err, rows) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                var team_home = rows[i].team_home;
                var team_away = rows[i].team_away;
                var logo_home = rows[i].logo_home;
                var logo_away = rows[i].logo_away;
                var time = rows[i].time;
                var league = rows[i].league;
                var details_url = rows[i].details_url;
                data[i] = {team_home: team_home, team_away: team_away, logo_home: logo_home, logo_away: logo_away, time: time, league: league, details_url: details_url};
            }
            res.send(data);
        }
    });
})

app.get('/euro/api/get_live_url', function(req, res){
    var details_url = req.param('details_url');
    var server = req.param('server');
    //http://tv.keonhacai.com/hot/k1_1.php
    new Crawler({
        maxConnections: 10,
        callback: function(error, result, $){
            if($){
                var iframe1Url = $('iframe').attr('src');
                var link_crawler = new Crawler({
                    maxConnections: 10,
                    callback: function(error, result, $){
                        if($){
                            var iframe2Url = $('iframe').attr('src');
                            if(iframe2Url.indexOf('youtube.com') > -1  || iframe2Url.indexOf('http://tv.keonhacai.com/talk.php') > -1){
                                var data = {live_url: iframe2Url};
                                res.send(data);  
                            } else {
                                if(iframe2Url.indexOf('http://tv.keonhacai.com/hot') > -1){
                                    iframe2Url = 'http://tv.keonhacai.com/hot/k1_' + server + ".php";
                                }
                                link_crawler.queue(iframe2Url);    
                            }
                        }
                    }
                });
                link_crawler.queue(iframe1Url);
            }
        }
    }).queue(details_url);
})

app.get('/euro/api/run_crawler', function(req, res){
    liveCrawler.crawl();
    res.sendStatus(200);
})

var server = app.listen(6868, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})
