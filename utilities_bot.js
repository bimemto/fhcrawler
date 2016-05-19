var login = require("facebook-chat-api");
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")

login({
    email: "+841656123802",
    password: "CG7U8rdbB7maAE"
}, function callback(err, api) {
    if (err) {
        return console.error(err);
    }
    db.connectDB(function(err, res) {

    });
    api.setOptions({
        listenEvents: true
    });
    var stopListening = api.listen(function(err, event) {
        if (err) {
            console.error(err);
        }
        if (event) {
            var dayBefore = 0;
            switch (event.type) {
                case "message":
                    if (event.body) {
                        if (event.body === '/stop') {
                            api.sendMessage("Goodbye...", event.threadID);
                            return stopListening();
                        }
                        else if (event.body.indexOf('/kq') > -1) {
                            api.markAsRead(event.threadID, function(err) {
                                if (err) console.log(err);
                            });
                            if (event.body.length > 4) {
                                var dayStr = event.body.split(' ')[1];
                                dayBefore = dayStr.substr(1, dayStr.length);
                            }
                            else {
                                dayBefore = 0;
                            }
                            var timestamp = Math.floor(Date.now() / 1000);
                            var opts = {
                                mode: 'save',
                                url: 'http://ketqua.net/xo-so-truyen-thong.php?ngay=' + getDateTime(dayBefore),
                                viewport_width: 1440,
                                delay: 1000,
                                selector: '#result_tab_mb',
                                scrape: true,
                                out_file: './kqxs' + timestamp + '.png'
                            };

                            banquo.capture(opts, function(err, bodyMarkup) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    setTimeout(function() {
                                        var msg = {
                                            body: "Kết quả",
                                            attachment: fs.createReadStream('kqxs' + timestamp + '.png')
                                        }
                                        api.sendMessage(msg, event.threadID);
                                    }, 2000);

                                }
                            });
                        }
                        else if (event.body.indexOf('/bd') > -1) {
                            api.markAsRead(event.threadID, function(err) {
                                if (err) console.log(err);
                            });
                            var team = '';
                            if (event.body.length > 4) {
                                team = event.body.split(' ')[1];
                            }
                            if (team === '') {
                                db.getAllHighlight(0, 20, function(err, rows) {
                                    if (err) {
                                        console.log(err);
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
                                            api.sendMessage(rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3, event.threadID);
                                        }
                                    }
                                });
                            }
                            else {
                                db.getHighLightByTeam(team, function(err, rows) {
                                    if (err) {
                                        api.sendMessage(team + ' có đá đéo đâu mà có. ngu', event.threadID);
                                    }
                                    else {
                                        if (rows.length === 0) {
                                            api.sendMessage(team + ' có đá đéo đâu mà có. ngu', event.threadID);
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
                                                if (team.indexOf('mu') > -1 || team.indexOf('Mu') > -1) {
                                                    message = message + '\r\n' + 'MU vô đối';
                                                }
                                                api.sendMessage(message, event.threadID);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else if (event.body.indexOf('/tt') > -1) {
                            api.markAsRead(event.threadID, function(err) {
                                if (err) console.log(err);
                            });
                            var timestamp = Math.floor(Date.now() / 1000);
                            var opts = {
                                mode: 'save',
                                url: 'http://www.24h.com.vn/ttcb/thoitiet/thoi-tiet-ha-noi',
                                viewport_width: 1440,
                                delay: 1000,
                                selector: '#div_box_ban_tin_thoi_tiet',
                                scrape: true,
                                out_file: './weather' + timestamp + '.png'
                            };

                            banquo.capture(opts, function(err, bodyMarkup) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    setTimeout(function() {
                                        var msg = {
                                            body: "Dự báo thời tiết",
                                            attachment: fs.createReadStream('weather' + timestamp + '.png')
                                        }
                                        api.sendMessage(msg, event.threadID);
                                    }, 2000);

                                }
                            });
                        }
                    }

                    break;
                case "event":
                    console.log(event);
                    break;
            }
        }

    });

});

function getDateTime(dayBefore) {

    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate() - dayBefore;
    day = (day < 10 ? "0" : "") + day;

    return day + "-" + month + "-" + year;

}