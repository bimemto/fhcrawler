var login = require("facebook-chat-api");
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request'); 
var Crawler = require("crawler");
var http = require('http');

var imgs = [];
var sentences = [];

fs.exists('botpage.json', function(exists) {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('botpage.json', 'utf8'));
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
        email: "+841656123802",
        password: "CG7U8rdbB7maAE"
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
        doAction(api);
      });
    }
  } else {
    login({
      email: "+841656123802",
      password: "CG7U8rdbB7maAE"
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
      doAction(api);
    });
  }
});

function callBotApi(command){
  request.post('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
    if(error) {
      return '';
    } else {
      return body;
    }
  }
});
}

function doAction(api){
  fs.writeFileSync('botpage.json', JSON.stringify(api.getAppState()));
  db.connectDB(function(res) {

  });
  api.setOptions({
    listenEvents: true,
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
          } else if(event.body.indexOf('/troi') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var mess = callBotApi('troi');
            api.sendMessage(mess, event.threadID);
          }  else if(event.body.indexOf('/img') > -1){
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



} else if(event.body.indexOf('/nt') > -1){
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  var msg = sentences[getRandomInt(0, sentences.length)];
  if(msg){
    if(msg.indexOf('.') === 2){
      msg = msg.substring(3, msg.length);
      api.sendMessage(msg, event.threadID); 
    } else if(msg.indexOf('.') === 1){
      msg = msg.substring(2, msg.length);
      api.sendMessage(msg, event.threadID);
    } else {
      api.sendMessage(msg, event.threadID);
    }
  }
} else if(event.body.indexOf('/rau') > -1){
  var type = '';
  var crawlUrl = '';
  if (event.body.length > 5) {
    type = event.body.substring(event.body.indexOf(' ') + 1);
  }
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

  return day + "-" + month + "-" + year;

}

var c = new Crawler({
  maxConnections: 10,
  callback: function(error, result, $) {
    if($){
      $('div.post-content.description').each(function(index, div){
        var p = $(div).find('p:not([class!=""])').each(function(index, p){
          var sentense = $(p).text();
          if(sentense.indexOf('{') < 0){
            sentences.push(sentense); 
          }
        })
      })
    }
  }
});

var c1 = new Crawler({
  maxConnections: 10,
  callback: function(error, result, $) {
    if($){
      $('div.entry-content').each(function(index, div){
        var p = $(div).find('p:not([class!=""])').each(function(index, p){
          var sentense = $(p).find('em:not([class!=""])').text();
          sentences.push(sentense); 
        })
      })
    }
  }
});

var c2 = new Crawler({
  maxConnections: 10,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
  callback: function(error, result, $) {
    if($){
      $('span[itemprop=articleBody]').each(function(index, span){
        var p = $(span).find('p:not([class!=""])').each(function(index, p){
          var sentense = $(p).text();
          if(sentense.indexOf('69') < 0){
            sentences.push(sentense); 
          }
        })
      })
    }
  }
});

c.queue('http://blogtraitim.info/nhung-cau-noi-bat-hu-hay-nhat-trong-tieu-thuyet-ngon-tinh/');

c1.queue('http://chiemtinhhoc.vn/tuyen-tap-nhung-cau-noi-hay-trong-tieu-thuyet-ngon-tinh/');
c1.queue('https://mannhuocbao.wordpress.com/2013/09/03/mot-so-cau-noi-hay-trong-ngon-tinh-1/');

c2.queue('http://danhngon.net/69-cau-noi-hay-trong-nhung-tieu-thuyet-ngon-tinh/');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
