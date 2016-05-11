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
                    $.sendMessage(rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + rows[i].VideoURL2 + '\r\n' + rows[i].VideoURL3);
                };
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
                    $.sendMessage(rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + rows[i].VideoURL2 + '\r\n' + rows[i].VideoURL3);
                };
            }
        });
    })
})
