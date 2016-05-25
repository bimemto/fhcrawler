'use strict'

var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var TelegramBot = require('node-telegram-bot-api');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

function download(url, callback) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  http.get(url, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var filters = ["duy ", "gamota", "android", "salem", "app", "native", "họp"];
var blockGroups = ['945316938871705', '127905330720913']

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.exists('appstate.json', function(exists) {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
    if(appstate){
     login({appState: appstate}, function callback (err, api) {
      if(err){
        switch (err.error) {
          case 'login-approval':
          console.log('Enter code > ');
          rl.on('line', function(line){
            err.continue(line);
            rl.close();
          });
          break;
        }
      }
      doAction(api);
    })} else {
      login({
        email: "duydkny@gmail.com",
        password: "4gA9NRfs4inxeWcmY4"
      }, function callback(err, api) {
        if(err){
          switch (err.error) {
            case 'login-approval':
            console.log('Enter code > ');
            rl.on('line', function(line){
              err.continue(line);
              rl.close();
            });
            break;
          }
        }
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
        doAction(api);
      });
    }
  } else {
    login({
      email: "duydkny@gmail.com",
      password: "4gA9NRfs4inxeWcmY4"
    }, function callback(err, api) {
      if(err){
        switch (err.error) {
          case 'login-approval':
          console.log('Enter code > ');
          rl.on('line', function(line){
            err.continue(line);
            rl.close();
          });
          break;
        }
      }
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
      doAction(api);
    });
  }
});

function doAction(api){
  api.setOptions({
    listenEvents: true
  });
  var stopListening = api.listen(function(err, event) {
    if (err) {
      console.log(err);
    }
    if(event.body){
      var groupName, from;
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
          var dayBefore = '';
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
              }, 1200);

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
      }, 1200);

    }
  });
}
else {
  for (var i = 0; i < filters.length; i++) {
    if (wordInString(event.body, filters[i])) {
      api.markAsRead(event.threadID, function(err) {
        if (err) console.log(err);
      });
      api.getThreadInfo(event.threadID, function(error, info) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(info);
          groupName = info.name;
          var isGroup = event.isGroup;
          if (isGroup && blockGroups.indexOf(event.threadID) < 0) {
            console.log('getUserInfo');
            api.getUserInfo(event.senderID, function(error, info) {
              if (error) {
                console.log(error);
              }
              else {
                var from = 'Ahihi';
                for (var prop in info) {
                  from = info[prop].name;
                }
                console.log('sendMessage', groupName + '\r\n' + from + ': ' + event.body);
                bot.sendMessage('-41541244', groupName + '\r\n' + from + ': ' + event.body);
              }
            })
          }
        }
      });
    }
  }
}
break;
case "event":
console.log(event);
break;
}
}
});
}

function getDateTime() {

  var date = new Date();

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return day + "-" + month + "-" + year;

}

function wordInString(s, word) {
  return new RegExp('\\b' + word + '\\b', 'i').test(s);
}

bot.on('message', function(message) {
  var chat_id = message.chat.id;
  console.log(message);
  if(message.text.indexOf('/fh') > -1){
    var team = '';
    if (message.text.length > 4) {
      team = message.text.split(' ')[1];
      db.getHighLightByTeam(team, function(err, rows) {
        if (err) {
          bot.sendMessage(message.chat.id, team + ' có đá đéo đâu mà có. ngu');
        }
        else {
          if (rows.length === 0) {
            bot.sendMessage(message.chat.id, team + ' có đá đéo đâu mà có. ngu');
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
              var msg = rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3;
              bot.sendMessage(message.chat.id, msg);
            }
          }
        }
      });
    } else {
      db.getAllHighlight(0, 20, function(err, rows) {
        if (err) {
          bot.sendMessage(message.chat.id, team + ' có đá đéo đâu mà có. ngu');
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
            bot.sendMessage(message.chat.id, rows[i].Title + '\r\n' + rows[i].VideoURL1 + '\r\n' + videoUrl2 + '\r\n' + videoUrl3);
          }
        }
      });
    }
  } else if(message.text.indexOf('/pes') > -1){
    var number = 1;
    if (message.text.length > 4) {
      number = message.text.split(' ')[1];
    }
    db.getPesFund(number, function(err, rows) {
      if (err) {
        bot.sendMessage(message.chat.id, 'ko có gì nha');
      }
      else {
        if (rows.length === 0) {
          bot.sendMessage(message.chat.id, 'ko có gì nha');
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
            var msg = rows[i].STT + '. ' + date + ':' + '\r\n\r\n' + changes + '\r\n' + duynk + diepdh + khanhpt + duypb + total + '\r\n' + note + '\r\n';
            bot.sendMessage(message.chat.id, msg);
          }
        }
      }
    });
}
});
