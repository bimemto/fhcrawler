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
} else if(event.body.indexOf('/troi') > -1){
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  api.sendMessage('.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n', event.threadID);
} else if(event.body.indexOf('/rau') > -1){
  var type = '';
  var crawlUrl = '';
  if (event.body.length > 5) {
    type = event.body.substring(event.body.indexOf(' ') + 1);
  }
  //available command: vip, kiemdinh, tdh, nkt, klm, tdt, hc, quadem, llq, lang, lb, gb, nts, cg, htm, new, maybay, sgvip, sgkiemdinh, tanbinh, q1-11, sgdem, phunhuan, govap
  if(type === 'vip'){
      crawlUrl = 'http://goihang.net/forums/gai-goi-ha-noi-cao-cap.31/';
  } else if(type === 'kiemdinh'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-ha-noi-kiem-dinh.29/';
  } else if(type === 'tdh'){
    var urls = ["http://goihang.net/forums/tran-duy-hung-f1.18/", "http://goihang.net/forums/tran-duy-hung-f2.17/", "http://goihang.net/forums/tran-duy-hung-f3.19/", "http://goihang.net/forums/hang-choi-dem-tdh.20/"];
    crawlUrl = urls[getRandomInt(0, 3)];
  } else if(type === 'nkt'){
    var urls = ["http://goihang.net/forums/nguyen-khanh-toan-f1.35/", "http://goihang.net/forums/hang-choi-dem-nkt.39/", "http://goihang.net/forums/nguyen-khanh-toan-f2.38/", "http://goihang.net/forums/hoang-quoc-viet.37/"];
    crawlUrl = urls[getRandomInt(0, 3)];
  } else if(type === 'klm'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-chua-boc-klm.41/';
  } else if(type === 'tdt'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-kham-thien-ton-duc-thang.129/';
  } else if(type === 'hc'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-khu-vuc-hoang-cau.131/';
  } else if(type === 'quadem'){
    crawlUrl = 'http://goihang.net/forums/hang-choi-dem.45/';
  } else if(type === 'llq'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-lac-long-quan-au-co-nghi-tam.132/';
  } else if(type === 'lang'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-duong-lang-nguyen-khang.21/';
  } else if(type === 'lb'){
    crawlUrl = 'http://goihang.net/forums/pho-co-long-bien-gia-lam.42/';
  } else if(type === 'gb'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-kim-dong-giap-bat.134/';
  } else if(type === 'nts'){
    crawlUrl = 'http://goihang.net/forums/nga-tu-so-thanh-xuan.44/';
  } else if(type === 'cg'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-cau-giay-xuan-thuy.151/';
  } else if(type === 'htm'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-dinh-thon-ho-tung-mau.36/';
  } else if(type === 'new'){
    crawlUrl = 'http://goihang.net/forums/hang-moi-len-chua-kiem-dinh.32/';
  } else if(type === 'maybay'){
    crawlUrl = 'http://goihang.net/forums/may-bay-tm.27/';
  } else if(type === 'sgvip'){
    crawlUrl = 'http://goihang.net/forums/hang-cao-cap.120/';
  } else if(type === 'sgkiemdinh'){
    crawlUrl = 'http://goihang.net/forums/hang-kiem-dinh.119/';
  } else if(type === 'tanbinh'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-tan-binh-tan-phu.107/';
  } else if(type === 'q1' || type === 'q3' || type === 'q5'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-quan-1-3-5.105/';
  } else if(type === 'q2' || type === 'q9'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-quan-2-quan-9.110/';
  } else if(type === 'sgdem'){
    crawlUrl = 'http://goihang.net/forums/hang-choi-dem.113/';
  } else if(type === 'phunhuan'){
    crawlUrl = 'http://goihang.net/forums/quan-phu-nhuan-binh-thanh.114/';
  } else if(type === 'q6' || type === 'q10' || type === 'q11'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-quan-6-10-11.108/';
  } else if(type === 'q4' || type === 'q7' || type === 'q8'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-quan-4-7-8.106/';
  } else if(type === 'q12' || type === 'govap'){
    crawlUrl = 'http://goihang.net/forums/gai-goi-quan-12-go-vap.109/';
  } else if(type === 'sg'){
    crawlUrl = 'http://goihang.net/forums/cac-quan-huyen-khac.111/';
  } else {
    crawlUrl = 'http://goihang.net/forums/tran-duy-hung-f1.18/';
  }
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
      if($){
        var root = $('ol.discussionListItems');
        var ol = root[getRandomInt(0, root.length - 1)];
        var hot = $(ol).find('li.discussionListItem.visible.sticky');
          var normal = $(ol).find('li.discussionListItem.visible');
          var hotItem = hot[getRandomInt(0, hot.length - 1)];
          var normalItem = normal[getRandomInt(0, normal.length - 1)];
          var result = [hotItem, normalItem];
          var resultItem = result[getRandomInt(0, 1)];
          var img = $(resultItem).find('img').attr('src');
          var title = $(resultItem).find('div.titleText').find('a.PreviewTooltip').text();
          var link = 'http://goihang.net/' + $(resultItem).find('div.titleText').find('a.PreviewTooltip').attr('href');
          var price = $(resultItem).find('div.titleText').find('a.prefixLink').find('span').text();
          var msg = price + '. ' + title + '\r\n' + link;
          api.sendMessage(msg, event.threadID);
      }
  }
  }).queue(crawlUrl);
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
  new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
      if($){
        var divPost = $('div.posts.sub-gallery.br5.first-child').find('div.post');
        var item = divPost[getRandomInt(0, divPost.length - 1)];
        var id = $(item).attr('id');
        var details_url = 'http://imgur.com/r/nsfw/' + id;
        new Crawler({
          maxConnections: 10,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
          callback: function(error, result, $) {
            if($){
              var img = $('div.post-image').find('img').attr('src');
              if(img === undefined || img === 'undefined' || img === ''){

              } else {
                var file = fs.createWriteStream("img.jpg");
                var url = 'http:' + img;
                      // var options = {
                      //     url: uri,
                      //     headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'}
                      // };

                      var request = http.get(url, function(response) {
                        if(response){
                          response.pipe(file);
                          file.on('finish', function(){
                            var msg = {
                              attachment: fs.createReadStream('img.jpg')
                            }
                            api.sendMessage(msg, event.threadID);
                          });
                        }
                      });
                    }
                  }
                }
              }).queue(details_url);
}
}
}).queue('http://imgur.com/r/nsfw');
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

// var c3 = new Crawler({
//   maxConnections: 10,
//   userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
//   callback: function(error, result, $) {
//     if($){
//       $('div.posts.sub-gallery.br5.first-child').find('div.post').each(function(index, div){
//         var id = $(div).attr('id');
//         var details_url = 'http://imgur.com/r/nsfw/' + id;
//         new Crawler({
//           maxConnections: 10,
//           userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
//           callback: function(error, result, $) {
//             if($){
//               var img = $('div.post-image').find('img').attr('src');
//               if(img === undefined || img === 'undefined' || img === ''){

//               } else {
//                 img = img.substring(2, img.length);
//                 imgs.push(img);
//               }
//             }
//           }
//         }).queue(details_url);
//       })
//     }
//   }
// });

// c3.queue('http://imgur.com/r/nsfw');