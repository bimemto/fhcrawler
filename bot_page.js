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
          }else if(event.body.indexOf('/troi') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            api.sendMessage('.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n', event.threadID);
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
          console.log(sentense);
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
