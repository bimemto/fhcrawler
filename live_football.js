var Crawler = require("crawler");
var url = require('url');
var db = require("./db.js");

var details_crawler = new Crawler({
    maxConnections: 10,
    callback: function(error, result, $){
        if($){
            var iframe1Url = $('iframe').attr('src');
            link_crawler.queue(iframe1Url);
        }
    }
});

var link_crawler = new Crawler({
    maxConnections: 10,
    callback: function(error, result, $){
        if($){
            var iframe2Url = $('iframe').attr('src');
            if(iframe2Url.indexOf('youtube.com') > -1 || iframe2Url.indexOf('tv.keonhacai.com') > -1){
                console.log('Link: ', iframe2Url);   
            } else {
                link_crawler.queue(iframe2Url);    
            }
        }
    }
});

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, result, $) {
        // $ is Cheerio by default
        var icon_home, icon_away;
        var team_home, team_away;
        var time, league;
        var details_url;
        if($){
            $('div.match-info.well').each(function(index, container){
                icon_home = $(container).find('div[class=icon]').find('img.attachment-48x48').attr('src');
                console.log('icon_home', icon_home);
                icon_away = $(container).find('div.icon.away').find('img.attachment-48x48').attr('src');
                console.log('icon_away', icon_away);
                team_home = $(container).find('h2[class=team]').find('p').text();
                if(team_home === ''){
                    team_home = $(container).find('h2[class=team]').find('i').text();
                }
                console.log('team_home', team_home);
                team_away = $(container).find('h2.team.away').find('p').text();
                if(team_away === ''){
                    team_away = $(container).find('h2.team.away').find('i').text();
                }
                console.log('team_away', team_away);
                time = $(container).find('div.meta').find('h4').text();
                league = $(container).find('div.meta').find('span:not([class!=""])').text();
                console.log('time', time);
                console.log('league', league);
                details_url = 'http://keonhacai.com/' + $(container).find('div.livelink.column').find('a').attr('href');
                console.log('details_url', details_url);
                db.insertLiveMatch(team_home, team_away, icon_home, icon_away, time, league, details_url, '');
            })
        }
    }
});

crawl = function() {
    db.clearMatches(function(result){
        c.queue('http://keonhacai.com');    
    });
};

module.exports.crawl = crawl;
