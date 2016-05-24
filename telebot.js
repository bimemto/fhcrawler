'use strict'

var tg = require('telegram-node-bot')('208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo')
var db = require("./db.js");
var dateFormat = require("dateformat");

tg.router.when(['/fh'], 'PingController')

tg.router.when(['/fh :team'], 'TeamController')

tg.router.when(['/pes :daysAgo'], 'PesFundController')

tg.router.when(['/pes'], 'PesFController')

tg.controller('PesFController', ($) => {
    tg.for('/pes', () => {
        db.getPesFund(1, function(err, rows) {
            if (err) {
                $.sendMessage('ko có gì nha');
            }
            else {
                if (rows.length === 0) {
                    $.sendMessage('ko có gì nha');
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        var changes = rows[i].Changes;
                        var duynk = rows[i].DuyNK;
                        var diepdh = rows[i].DiepDH;
                        var khanhpt = rows[i].KhanhPT;
                        var duypb = rows[i].DuyPB;
                        var total = 'Quỹ còn: ' + rows[i].Total;
                        var note = 'Note: ' + rows[i].Note;
                        var date = dateFormat(rows[i].TimeAdded, "dddd dd-mm-yyyy");
                        if(changes !== '0'){
                            if(changes.indexOf('-') > -1){
                                changes = 'Chơi hết: ' + rows[i].Changes;
                            } else {
                                changes = 'Thêm quỹ: ' + rows[i].Changes;
                            }
                        } else {
                            changes = '';
                        }
                        if(duynk !== '0'){
                            duynk = 'DuyNK: đã đóng ' + rows[i].DuyNK + '\r\n';
                        } else {
                            duynk = '';
                        }
                        if(diepdh !== '0'){
                            diepdh = 'DiepDH: đã đóng ' + rows[i].DiepDH + '\r\n';
                        } else {
                            diepdh = '';
                        }
                        if(khanhpt !== '0'){
                            khanhpt = 'KhanhPT: đã đóng ' + rows[i].KhanhPT + '\r\n';
                        } else {
                            khanhpt = '';
                        }
                        if(duypb !== '0'){
                            duypb = 'DuyPB: đã đóng ' + rows[i].DuyPB + '\r\n';
                        } else {
                            duypb = '';
                        }
                        var message = date + ':' + '\r\n\r\n' + changes + '\r\n' + duynk + diepdh + khanhpt + duypb + total + '\r\n' + note + '\r\n';
                        $.sendMessage(message);
                    }
                }
            }
        });
})
})

tg.controller('PesFundController', ($) => {
    tg.for('/pes :daysAgo', () => {
        if($.query.daysAgo > 10){
            $.query.daysAgo = 10;
        }
        db.getPesFund($.query.daysAgo, function(err, rows) {
            if (err) {
                $.sendMessage('ko có gì nha');
            }
            else {
                if (rows.length === 0) {
                    $.sendMessage('ko có gì nha');
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        var changes = rows[i].Changes;
                        var duynk = rows[i].DuyNK;
                        var diepdh = rows[i].DiepDH;
                        var khanhpt = rows[i].KhanhPT;
                        var duypb = rows[i].DuyPB;
                        var total = 'Quỹ còn: ' + rows[i].Total;
                        var note = 'Note: ' + rows[i].Note;
                        var date = dateFormat(rows[i].TimeAdded, "dddd dd-mm-yyyy");
                        if(changes !== '0'){
                            if(changes.indexOf('-') > -1){
                                changes = 'Chơi hết: ' + rows[i].Changes;
                            } else {
                                changes = 'Thêm quỹ: ' + rows[i].Changes;
                            }
                        } else {
                            changes = '';
                        }
                        if(duynk !== '0'){
                            duynk = 'DuyNK: đã đóng ' + rows[i].DuyNK + '\r\n';
                        } else {
                            duynk = '';
                        }
                        if(diepdh !== '0'){
                            diepdh = 'DiepDH: đã đóng ' + rows[i].DiepDH + '\r\n';
                        } else {
                            diepdh = '';
                        }
                        if(khanhpt !== '0'){
                            khanhpt = 'KhanhPT: đã đóng ' + rows[i].KhanhPT + '\r\n';
                        } else {
                            khanhpt = '';
                        }
                        if(duypb !== '0'){
                            duypb = 'DuyPB: đã đóng ' + rows[i].DuyPB + '\r\n';
                        } else {
                            duypb = '';
                        }
                        var message = date + ':' + '\r\n\r\n' + changes + '\r\n' + duynk + diepdh + khanhpt + duypb + total + '\r\n' + note + '\r\n';
                        $.sendMessage(message);
                    }
                }
            }
        });
})
})

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
                $.sendMessage($.query.team + ' có đá đéo đâu mà có. ngu');
            }
            else {
                if (rows.length === 0) {
                    $.sendMessage($.query.team + ' có đá đéo đâu mà có. ngu');
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
                        var message = rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3;
                        if ($.query.team.indexOf('chelsea') > -1 || $.query.team.indexOf('Chelsea') > -1) {
                            message = message + '\r\n' + 'Chelsea vô đối';
                        }
                        $.sendMessage(message);
                    }
                }
            }
        });
})
})
