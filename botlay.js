'use strict'

var YQL = require("yql");
var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var TelegramBot = require('node-telegram-bot-api');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request');
var CronJob = require('cron').CronJob;

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var webshot = require('webshot');


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
          webshot('http://ketqua.vn/in-ve-so/22/1/' + getDateTime(dayBefore) + '/1', 'kqxs' + timestamp + '.png', function(err) {
            if(err){
              console.log(err);
            } else {
              var msg = {
                body: "Kết quả",
                attachment: fs.createReadStream('kqxs' + timestamp + '.png')
              }
              api.sendMessage(msg, event.threadID);
            }

          });
        // var opts = {
        //   mode: 'save',
        //   url: 'http://ketqua.vn/in-ve-so/22/1/' + getDateTime(dayBefore) + '/1',
        //   viewport_width: 640,
        //   delay: 1000,
        //   scrape: true,
        //   out_file: './kqxs' + timestamp + '.png'
        // };

        // banquo.capture(opts, function(err, bodyMarkup) {
        //   if (err) {
        //     console.log(err)
        //   }
        //   else {
        //     setTimeout(function() {
        //       var msg = {
        //         body: "Kết quả",
        //         attachment: fs.createReadStream('kqxs' + timestamp + '.png')
        //       }
        //       api.sendMessage(msg, event.threadID);
        //     }, 1200);

        //   }
        // });
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
  var query = new YQL("select * from weather.forecast where (woeid = 2347727) and u='c'");

  query.exec(function(err, data) {
    var location = data.query.results.channel.location;
    var wind = data.query.results.channel.wind;
    var condition = data.query.results.channel.item.condition;
    var forecast = data.query.results.channel.item.forecast;
    var forecastMsg = '';
    forecastMsg = 'Mai:' + '\r\n' + 'Cao: ' + forecast[0].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[0].low + ' độ xê' + '\r\n' + forecast[0].text + '\r\n' + '\r\n'
    + 'Ngày kia:' + '\r\n' + 'Cao: ' + forecast[1].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[1].low + ' độ xê' + '\r\n' + forecast[1].text + '\r\n' + '\r\n'
    + 'Ngày kìa:' + '\r\n' + 'Cao: ' + forecast[2].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[2].low + ' độ xê' + '\r\n' + forecast[2].text + '\r\n';
    var weatherMsg = 'Hôm nay:' + '\r\n'
    + condition.temp + ' độ xê' + '\r\n'
    + 'Gió ' + degToCompass(wind.direction) + ' ' + wind.speed + ' km/h' + '\r\n'
    + condition.text + '\r\n';
    api.sendMessage(weatherMsg + '\r\n' + forecastMsg, event.threadID);
  });
} else if(event.body.indexOf('/tho') > -1){
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  var words = '';
  if (event.body.length > 5) {
    words = event.body.substring(event.body.indexOf(' ') + 1);
  }
  request.post('http://thomay.vn/index.php?q=tutaochude2', 
    {form: {
      'dieukien_tu': '',
      'dieukien_tu_last': '',
      'fullbaitho': 'Thêm một khổ',
      'last': '',
      'order': '0',
      'order_cu': '0',
      'poem': '',
      'poemSubject_tutao': '1',
      'poemType': 'Lục bát',
      'theloai': 'tho',
      'tulap[cu]': '',
      'tulap[moi]': '',
      'tungcau_kho': '',
      'tunhap_chude': words,
      'van[cu]': '',
      'van[moi]': '',
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      var $ = cheerio.load(body, { decodeEntities: false });
      var tho = $('font').attr('color', 'Blue').html().split('<br>').join('\r\n');
      api.sendMessage(tho, event.threadID);
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

function getDateTime(dayBefore) {

  var date = new Date();

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate() - dayBefore;
  day = (day < 10 ? "0" : "") + day;

  return year + "-" + month + "-" + day;

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
} else if(message.text.indexOf('/fc') > -1){
  var degree = 1;
  if (message.text.length > 4) {
    degree = message.text.split(' ')[1];
  }
  var converted = (degree - 32) * (5/9);
  bot.sendMessage(message.chat.id, degree + ' độ ép = ' + converted + ' độ xê');
} else if(message.text.indexOf('/cf') > -1){
  var degree = 1;
  if (message.text.length > 4) {
    degree = message.text.split(' ')[1];
  }
  var converted = degree * 9/5 + 32;
  bot.sendMessage(message.chat.id, degree + ' độ xê = ' + converted + ' độ ép');
}
});

var job = new CronJob({
  cronTime: '00 00 07 * * 0-6',
  onTick: function() {
    db.getSentence1(function(error, rows){
      if (error) {
        console.log(error);
      } else {
        var message = rows[0].Text;
        bot.sendMessage('-41541244', message);  
      }
    });
  },
  start: true,
});
job.start();

var job1 = new CronJob({
  cronTime: '00 01 07 * * 0-6',
  onTick: function() {
    db.getSentence2(function(error, rows){
      if (error) {
        console.log(error);
      } else {
        var message = rows[0].Text;
        bot.sendMessage('-41541244', message);  
      }
    });
  },
  start: true,
});
job1.start();

function degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
  return arr[(val % 16)];
}
