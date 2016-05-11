'use strict'

var tg = require('telegram-node-bot')('208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo')
var db = require("./db.js");

tg.router.when(['/fh'], 'PingController')

tg.router.when(['/fh :team'], 'TeamController')

tg.controller('PingController', ($) => {
    tg.for('/fh', () => {
        db.getAllHighlight(0, 20, function(err, rows) {
            if (err) {
                $.sendMessage(err);
            }
            else {
                for (var i = 0; i < rows.length; i++) {
                    var videoUrl2 = rows[i].VideoURL2;
                    var videoUrl3 = rows[i].VideoURL3;
                    if (videoUrl2 === null || videoUrl2 === 'null') {
                        videoUrl2 = "";
                    }
                    if (videoUrl3 === 'null' || videoUrl3 === null) {
                        videoUrl3 = "";
                    }
                    $.sendMessage(rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3);
                }
            }
        });
    })
})

tg.controller('TeamController', ($) => {
    tg.for('/fh :team', () => {
        db.getHighLightByTeam($.query.team, function(err, rows) {
            if (err) {
                $.sendMessage(err);
            }
            else {
                for (var i = 0; i < rows.length; i++) {
                    var videoUrl2 = rows[i].VideoURL2;
                    var videoUrl3 = rows[i].VideoURL3;
                    if (videoUrl2 === null || videoUrl2 === 'null') {
                        videoUrl2 = "";
                    }
                    if (videoUrl3 === 'null' || videoUrl3 === null) {
                        videoUrl3 = "";
                    }
                    $.sendMessage(rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3);
                };
            }
        });
    })
})
