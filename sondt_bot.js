'use strict'

var YQL = require("yql");
var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request');
var CronJob = require('cron').CronJob;
var Crawler = require("crawler");
var webshot = require('webshot');

var imgs = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.exists('sondt.json', function(exists) {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('sondt.json', 'utf8'));
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
        email: "appvnseeding@yahoo.com",
        password: "yeuyeu1985"
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
        fs.writeFileSync('sondt.json', JSON.stringify(api.getAppState()));
        doAction(api);
      });
    }
  } else {
    login({
      email: "appvnseeding@yahoo.com",
      password: "yeuyeu1985"
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
      fs.writeFileSync('sondt.json', JSON.stringify(api.getAppState()));
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
    if(event && event.body){
      console.log(event);
      var groupName, from;
      switch (event.type) {
        case "message":
        if (event.body === '/stop') {
          api.sendMessage("Goodbye...", event.threadID);
          return stopListening();
        } else if (event.body.indexOf('/kq') > -1) {
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
            var weatherMsg = 'Bây giờ:' + '\r\n'
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
      if($('font').attr('color', 'Blue').html()){
        var tho = $('font').attr('color', 'Blue').html().split('<br>').join('\r\n');
        api.sendMessage(tho, event.threadID);
      } else {
       api.sendMessage('Khó thế éo làm đc', event.threadID);
     }
   }
 });
} else if(event.body.indexOf('/img') > -1){
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  var uri = 'http://' + imgs[getRandomInt(0, imgs.length)];
  var file = fs.createWriteStream("sondt.jpg");
                        // var options = {
                        //     url: uri,
                        //     headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'}
                        // };

                        http.get(uri, function(response) {
                          if(response){
                            response.pipe(file);
                            file.on('finish', function(){
                              var msg = {
                                attachment: fs.createReadStream('sondt.jpg')
                              }
                              api.sendMessage(msg, event.threadID);
                            });
                          }
                        });
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

function degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
  return arr[(val % 16)];
}

var c3 = new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
      if($){
        $('div.posts.sub-gallery.br5.first-child').find('div.post').each(function(index, div){
          var id = $(div).attr('id');
          var details_url = 'http://imgur.com/r/nsfw/' + id;
          new Crawler({
            maxConnections: 10,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
            callback: function(error, result, $) {
              if($){
                var img = $('div.post-image').find('img').attr('src');
                if(img === undefined || img === 'undefined' || img === ''){

                } else {
                  img = img.substring(2, img.length);
                  imgs.push(img);
              }
          }
      }
  }).queue(details_url);
      })
    }
}
});

c3.queue('http://imgur.com/r/nsfw');