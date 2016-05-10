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
        //a lean implementation of core jQuery designed specifically for the server
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            if (toQueueUrl) {
                if (toQueueUrl.indexOf('http://www.24h.com.vn/') < 0) {
                    toQueueUrl = 'http://www.24h.com.vn' + toQueueUrl;
                }
                if (toQueueUrl.indexOf('video-ban-thang') > -1) {
                    c.queue([{
                        uri: toQueueUrl,
                        jQuery: true,
                        // The global callback won't be called
                        callback: function(error, result, $) {
                            if ($) {
                                var length = $('div').find('.zplayerDiv').length;
                                var title, date, desc, thumb, video1, video2, video3;
                                if (length == 1) {
                                    //get title
                                    $('h1.baiviet-title').each(function(index, h1) {
                                            title = trim($(h1).text());
                                        })
                                        //get video url
                                    $('div.zplayerDiv').each(function(index, div) {
                                            var dataConfig = $(div).attr('data-config');
                                            var arr = dataConfig.toString().split("&");
                                            for (var i = 0; i < arr.length; i++) {
                                                if (arr[i].startsWith('file=http://24h-video')) {
                                                    var videos = arr[i].substring(5, arr[i].length);
                                                    if (videos.indexOf('***') > -1) {
                                                        var videoUrl = videos.split("***");
                                                        var totalVideos = videoUrl.length;
                                                        if (totalVideos < 3) {
                                                            video1 = videoUrl[0];
                                                            video2 = videoUrl[1];
                                                        }
                                                        else {
                                                            video1 = videoUrl[0];
                                                            video2 = videoUrl[1];
                                                            video3 = videoUrl[2];
                                                        }
                                                    }
                                                    else {
                                                        video1 = videos;
                                                    }
                                                }
                                            }
                                        })
                                        //get thumb
                                    thumb = $('img.news-image').attr('src');
                                    console.log('Thumb:', thumb);
                                    //get date
                                    date = $('div.baiviet-ngay').text();
                                    console.log('Date:', date);
                                    //get short desc
                                    desc = trim($('p.baiviet-sapo').text());
                                    console.log('Desc:', desc);
                                    //insert to DB
                                    db.insertHighlight(title, date, desc, thumb, video1, video2, video3);
                                }
                            }
                        }
                    }]);
                }
            }
        });
    }
});

// Queue just one URL, with default callback
c.queue('http://www.24h.com.vn/video-ban-thang-c297.html');
