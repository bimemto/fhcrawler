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
                // $('div[class=icon]').each(function(index, div) {
                //     $(div).find('img.attachment-48x48').each(function(index, img){
                //         icon_home = $(img).attr('src');
                //         console.log('icon_home', icon_home);
                //     })
                // })
                // $('div.icon.away').each(function(index, div) {
                //     $(div).find('img.attachment-48x48').each(function(index, img){
                //         icon_away = $(img).attr('src');
                //         console.log('icon_away', icon_away);
                //     })
                // })
                team_home = $(container).find('h2[class=team]').find('p').text();
                if(team_home === ''){
                    team_home = $(container).find('h2[class=team]').find('i').text();
                }
                console.log('team_home', team_home);
                // $('h2[class=team]').each(function(index, h2) {
                //     $(h2).find('p').each(function(index, p){
                //         team_home = $(p).text();
                //         console.log('team_home', team_home);
                //     })
                // })
                team_away = $(container).find('h2.team.away').find('p').text();
                if(team_away === ''){
                    team_away = $(container).find('h2.team.away').find('i').text();
                }
                console.log('team_away', team_away);
                // $('h2.team.away').each(function(index, h2) {
                //     $(h2).find('p').each(function(index, p){
                //         team_away = $(p).text();
                //         console.log('team_away', team_away);
                //     })
                // })
                time = $(container).find('div.meta').find('h4').text();
                league = $(container).find('div.meta').find('span:not([class!=""])').text();
                console.log('time', time);
                console.log('league', league);
                // $('div.meta').each(function(index, div) {
                //     $(div).find('h4').each(function(index, h4){
                //         time = $(h4).text();
                //         console.log('time', time);
                //     })
                //     $(div).find('span:not([class!=""])').each(function(index, span){
                //         league = $(span).text();
                //         console.log('league', league);
                //     })
                // })
                details_url = 'http://keonhacai.com/' + $(container).find('div.livelink.column').find('a').attr('href');
                console.log('details_url', details_url);
                //details_crawler.queue(details_url);
                // $('div.livelink.column').each(function(index, div){
                //     $(div).find('a').each(function(index, a){
                //         details_url = 'http://keonhacai.com/' + $(a).attr('href');
                //         console.log('details_url', details_url);
                //         details_crawler.queue(details_url);
                //     })
                // })
                db.insertLiveMatch(team_home, team_away, icon_home, icon_away, time, league, details_url, '');
            })

}
}
});

// db.connectDB(function(error, result) {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             c.queue('http://keonhacai.com');
//         }
//     });

crawl = function() {
    db.connectDB(function(error, result) {
        if (error) {
            console.log(error);
        }
        else {
            c.queue('http://keonhacai.com');
        }
    });
};

module.exports.crawl = crawl;
