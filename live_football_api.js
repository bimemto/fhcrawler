var db = require("./db.js");
var express = require('express');
var app = express();
var Crawler = require("crawler");
var liveCrawler = require("./live_football.js");

app.get('/euro/api/match_list', function(req, res) {
    db.getMatchList(function(err, rows) {
        if (err) {
            res.send("Error");
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
    if(server === undefined || server === 'undefined'){
        server = 1;
    }
    new Crawler({
        maxConnections: 10,
        callback: function(error, result, $){
            if($){
                var iframe1Url = $('iframe').attr('src');
                if(iframe1Url){
                    var link_crawler = new Crawler({
                    maxConnections: 10,
                    callback: function(error, result, $){
                        if($){
                            var iframe2Url = $('iframe').attr('src');
                            console.log('ahihi', iframe2Url);
                            if(iframe2Url){
                                if(iframe2Url.indexOf('youtube.com') > -1  || iframe2Url.indexOf('http://tv.keonhacai.com/talk.php') > -1){
                                    if(iframe2Url.lastIndexOf('//', 0) === 0){
                                        iframe2Url = 'http:' + iframe2Url;
                                    }
                                    var data = {live_url: iframe2Url};
                                    res.send(data); 
                                } else if(iframe2Url.indexOf('sportstream365.com') > -1){
                                    iframe2Url = 'http:' + iframe2Url;
                                    var data = {live_url: iframe2Url};
                                    res.send(data);
                                } else {
                                    if(iframe2Url.indexOf('http://tv.keonhacai.com/hot') > -1){
                                        iframe2Url = 'http://tv.keonhacai.com/hot/k1_' + server + ".php";
                                    }
                                    link_crawler.queue(iframe2Url);    
                                }
                            } else {
                                var data = {live_url: ''};
                                res.send(data);
                            }
                        } else {
                            var data = {live_url: ''};
                            res.send(data);
                        }
                    }
                    });
                    link_crawler.queue(iframe1Url);
                } else {
                    var data = {live_url: ''};
                    res.send(data);
                }
            } else {
                var data = {live_url: ''};
                res.send(data);
            }
        }
    }).queue(details_url);
})

var server = app.listen(6868, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
})
