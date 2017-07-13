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
var Crawler = require("crawler");

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var webshot = require('webshot');
var tinh_nguoi = false;
var imgs = [];
var sentences = [];

function callBotApi(command, callback){
  request.get('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
    if(error) {
      callback('');
    } else {
      callback(body);
    }
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var filters = ["duy", "salem", "họp"];
var blockGroups = ['945316938871705', '1086254248112194']

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
      selfListen: true,
      logLevel: "silent"
    });
    var stopListening = api.listen((err, message) => {
      if (err) {
        console.log(err);
      }
      if(message){
        console.log(event);
        var groupName, from;
        if(typeof message.body === "string"){
          if (message.body === '/stop') {
            api.sendMessage("Goodbye...", message.threadID);
            return stopListening();
          } else if (message.body.indexOf('/kq') > -1) {
            api.markAsRead(message.threadID, function(err) {
              if (err) console.log(err);
            });
            var command = message.body.substring(1, message.body.length);
            var timestamp = Math.floor(Date.now() / 1000);
            callBotApi(command, function(result){
              webshot(result, 'kqxs' + timestamp + '.png', function(err) {
                if(err){
                  console.log(err);
                } else {
                  var msg = {
                    body: "Kết quả",
                    attachment: fs.createReadStream('kqxs' + timestamp + '.png')
                  }
                  api.sendMessage(msg, message.threadID);
                }
              });
            });
          }
          else if (message.body.indexOf('/bd') > -1) {
            api.markAsRead(message.threadID, function(err) {
              if (err) console.log(err);
            });
            var team = '';
            if (message.body.length > 4) {
              team = message.body.split(' ')[1];
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
            var mess = callBotApi('tt', function(result){
              api.sendMessage(result, event.threadID);
            });
          } else if(event.body.indexOf('/tho') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var command = event.body.substring(1, event.body.length);
            callBotApi(command, function(result){
              api.sendMessage(result, event.threadID);
            });
          } else {
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
        }

      }
    });
  }

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

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
      } else if(message.text.indexOf('/quay') > -1){
        fs.readFile('quay.txt', 'utf8', function (err,data) {
          if (err) {
            console.log(err);
          } else {
            bot.sendMessage(message.chat.id, data);
          }
        });
      } else if(message.text.indexOf('/nude') > -1){
        callBotApi('nude', function(result){
          bot.sendMessage(message.chat.id, result);
        });
      } else if(message.text.indexOf('/pes') > -1){
        var number = 1;
        if (message.text.length > 4) {
          number = message.text.split(' ')[1];
        }
        if(number === 'pair'){
          bot.sendMessage(message.chat.id, 'Khanh: ' + getRandomInt(0, 200) + '\r\n' + 'Điệp: ' + getRandomInt(0, 200) + '\r\n' + 'Bá: ' + getRandomInt(0, 200) + '\r\n' + 'Khánh: ' + getRandomInt(0, 200));
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
      } else if(message.text.indexOf('/img') > -1){
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
                      bot.sendMessage(message.chat.id, url);
                    }
                  }
                }
              }).queue(details_url);
            }
          }
        }).queue('http://imgur.com/r/nsfw');
      } else if(message.text.indexOf('/nt') > -1){
        bot.sendMessage(message.chat.id, sentences[getRandomInt(0, sentences.length)]);
      }
    }
  });

  // var job = new CronJob({
  //   cronTime: '00 00 07 * * 0-6',
  //   onTick: function() {
  //     db.getSentence1(function(error, rows){
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         var message = rows[0].Text;
  //         bot.sendMessage('-41541244', message);
  //       }
  //     });
  //   },
  //   start: true,
  // });
  // job.start();

  // var job1 = new CronJob({
  //   cronTime: '00 01 07 * * 0-6',
  //   onTick: function() {
  //     db.getSentence2(function(error, rows){
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         var message = rows[0].Text;
  //         bot.sendMessage('-41541244', message);
  //       }
  //     });
  //   },
  //   start: true,
  // });
  // job1.start();

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
