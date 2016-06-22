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
var bodyParser = require("body-parser");
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var token = '221326717:AAFywbKelgnmUOigfDpRbCCCyrX_HfTbzK4';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var webshot = require('webshot');

app.post('/bot',function(req, res){
  var messenger = req.param('messenger', null);
  var group_id = req.param('group_id', null);
  var content = req.param('content', null);
  console.log("messenger: = "+messenger+", group_id: "+group_id + ", content: " + content);
  if(messenger === 'telegram'){
    bot.sendMessage(group_id, content);
  }
  res.send('OK');
});

var server = app.listen(6996, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  if(message.text){
   if(message.text.indexOf('/fc') > -1){
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
  } else if (message.text.indexOf('/kq') > -1) {
    var dayBefore = '';
    if (message.text.length > 4) {
      var dayStr = message.text.split(' ')[1];
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
        var photo = 'kqxs' + timestamp + '.png';
        bot.sendPhoto(message.chat.id, photo, {caption: 'Kết quả'});
      }

    });
  } else if (message.text.indexOf('/tt') > -1) {
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
      var weatherMsg = 'Bây giờ:' + '\r\n'
      + condition.temp + ' độ xê' + '\r\n'
      + 'Gió ' + degToCompass(wind.direction) + ' ' + wind.speed + ' km/h' + '\r\n'
      + condition.text + '\r\n';
      bot.sendMessage(message.chat.id, weatherMsg + '\r\n' + forecastMsg);
    });
} else if(message.text.indexOf('/poem') > -1){
  var words = '';
  if (message.text.length > 5) {
    words = message.text.substring(message.text.indexOf(' ') + 1);
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
      if($('font').attr('color', 'Blue').html()){
        var tho = $('font').attr('color', 'Blue').html().split('<br>').join('\r\n');
        bot.sendMessage(message.chat.id, tho);
      } else {
        bot.sendMessage(message.chat.id, 'Khó thế éo làm đc');
      }
    }
  });
} else if(message.text.indexOf('/ga') > -1){
  var app_name = '';
  if (message.text.length > 4) {
    app_name = message.text.split(' ')[1];
  }
  if(app_name === 'beatvn'){
    request.get('http://nhayau.com/GA/BeatAnalytics.php', {json: true}, function(error, response){
      if(error){
        console.log(error);
      } else {
        if(response){
          if(response.body){
            console.log(response.body);
            var ccuMsg = '';
            for(var i = 0; i < response.body.length; i++){
              var name = response.body[i].name;
              var ccu = response.body[i].ccu;
              ccuMsg = ccuMsg + name + ': ' + ccu + '\r\n';
            }
            bot.sendMessage(message.chat.id, ccuMsg);
          }
        }
      }
    })
  }
}
}
});

function degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
  return arr[(val % 16)];
}

fs.exists('diepdj.json', function(exists) {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('diepdj.json', 'utf8'));
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
          email: "johnie.dip@gmail.com",
          password: "Th7NGGx6H8k6gjszYxMGx74cuX7gg6"
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
          fs.writeFileSync('diepdj.json', JSON.stringify(api.getAppState()));
          doAction(api);
        });
      }
    } else {
      login({
        email: "johnie.dip@gmail.com",
        password: "Th7NGGx6H8k6gjszYxMGx74cuX7gg6"
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
        fs.writeFileSync('diepdj.json', JSON.stringify(api.getAppState()));
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
    if(event){
      if(event.body){
        console.log(event);
        switch (event.type) {
          case "message":
          if (event.body === '/stop') {
            api.sendMessage("Goodbye...", event.threadID);
            return stopListening();
          } else if(event.body.indexOf('/ga') > -1){
            var app_name = '';
            if (event.body.length > 4) {
              app_name = event.body.split(' ')[1];
            }
            if(app_name === 'beatvn'){
              request.get('http://nhayau.com/GA/BeatAnalytics.php', {json: true}, function(error, response){
                if(error){
                  console.log(error);
                } else {
                  if(response){
                    if(response.body){
                      console.log(response.body);
                      var ccuMsg = '';
                      for(var i = 0; i < response.body.length; i++){
                        var name = response.body[i].name;
                        var ccu = response.body[i].ccu;
                        ccuMsg = ccuMsg + name + ': ' + ccu + '\r\n';
                      }
                      api.sendMessage(ccuMsg, event.threadID);
                    }
                  }
                }
              })
            }
          }
          break;
          case "event":
          console.log(event);
          break;
        }
      }
    }

  });
}
