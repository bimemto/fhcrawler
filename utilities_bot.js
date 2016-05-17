var login = require("facebook-chat-api");
var banquo = require('banquo');
var fs = require("fs");
var format = require('string-format')

login({
    email: "+841656123802",
    password: "CG7U8rdbB7maAE"
}, function callback(err, api) {
    if (err) {
        return console.error(err);
    }
    api.setOptions({
        listenEvents: true
    });
    var stopListening = api.listen(function(err, event) {
        if (err) {
            console.error(err);
        }
        console.log(event);
        var dayBefore = 0;
        switch (event.type) {
            case "message":
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
                break;
            case "event":
                console.log(event);
                break;
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