var login = require("facebook-chat-api");
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request');
var Crawler = require("crawler");
var http = require('http');
var replaceall = require("replaceall");

var imgs = [];
var sentences = [];

var webshot = require('webshot');

var credentials = {email: "duydkny@gmail.com", password: "4gA9NRfs4inxeWcmY4"};

fs.exists('mybot.json', (exists) => {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('mybot.json', 'utf8'));
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
        } else {
          doAction(api);
        }
      })} else {
        login(credentials, (err, api) => {
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
          } else {
              doAction(api);
          }
        });
      }
    } else {
      login(credentials, (err, api) => {
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
        } else {
          doAction(api);
        }
      });
    }
  });

  function callBotApi(command, callback){
    request.get('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
      if(error) {
        callback('');
      } else {
        callback(body);
      }
    });
  }

  function doAction(api) {
    //fs.writeFileSync('botpage.json', JSON.stringify(api.getAppState()));
    api.setOptions({
      selfListen: true,
      logLevel: "silent"
    });
    var stopListening = api.listen((err, event) => {
      if (err) {
        console.error(err);
      }
      if (event) {
        var dayBefore = 0;
        console.log(event);
        if(typeof event.body === "string"){
          if (event.body === '/stop') {
            api.sendMessage("Goodbye...", event.threadID);
            return stopListening();
          } else if(event.body.indexOf('/troi') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var mess = callBotApi('troi', function(result){
              api.sendMessage(result, event.threadID);
            });
          }  /*else if(event.body.indexOf('/img') > -1 || event.body.indexOf('/vếu') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var mess = callBotApi('img', function(result){
              var file = fs.createWriteStream("img.jpg");
              var request = http.get(result, function(response) {
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
            });
          }*/ else if(event.body.indexOf('/nt') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var mess = callBotApi('nt', function(result){
              api.sendMessage(result, event.threadID);
            });
          } else if(event.body.indexOf('/kq') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            var command = event.body.substring(1, event.body.length);
            var timestamp = Math.floor(Date.now() / 1000);
            callBotApi(command, function(result){
              webshot(result, 'kqxs' + timestamp + '.png', function(err) {
                if(err){
                  console.log(err);
                } else {
                  var msg = {
                    attachment: fs.createReadStream('kqxs' + timestamp + '.png')
                  }
                  api.sendMessage(msg, event.threadID);
                }
              });
            });
          } else if(event.body.indexOf('/tt') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            callBotApi('tt', function(result){
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
          } else if(event.body.indexOf('/tnl') > -1){
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            callBotApi('tnl', function(result){
              api.sendMessage(result, event.threadID);
            });
          } else if(event.threadID === '1561582510560190'){
            // 100009905582647
            api.markAsRead(event.threadID, function(err) {
              if (err) console.log(err);
            });
            if(event.senderID === '100000404491080' || event.senderID === '100005017784835' || event.senderID === '100002542018182' /*|| event.senderID === '100000228498924'*/){
              if(event.body.length > 0){
                var text = replaceall('d', 'H', event.body);
                text = replaceall('D', 'H', text);
                text = replaceall('u', 'ữ', text);
                text = replaceall('U', 'ữ', text);
                text = replaceall('y', 'u', text);
                text = replaceall('Y', 'u', text);
                text = replaceall('l', 'S', text);
                text = replaceall('L', 'S', text);
                text = replaceall('p', 'T', text);
                text = replaceall('P', 'T', text);
                text = replaceall('g', 'k', text);
                text = replaceall('G', 'k', text);
                text = replaceall('n', 'L', text);
                text = replaceall('N', 'L', text);
                //var text = event.body.replace('d', 'H').replace('D', 'H').replace('u', 'ữ').replace('U', 'ữ').replace('y', 'u').replace('Y', 'u').replace('l', 'S').replace('L', 'S');
                api.sendMessage({
                  body: text
                }, event.threadID);
              } else {
                if(event.hasOwnProperty('attachments')){
                  if(event.attachments[0].type === 'sticker'){
                    api.sendMessage({
                      sticker: event.attachments[0].stickerID
                    }, event.threadID);
                  } else if(event.attachments[0].type === 'photo'){
                    //var file = fs.createWriteStream("echo_photo.jpg");
                    request(event.attachments[0].previewUrl, {encoding: 'binary'}, function(error, response, body) {
                      fs.writeFile('echo_photo.jpg', body, 'binary', function (err) {
                        var msg = {
                          attachment: fs.createReadStream('echo_photo.jpg')
                        }
                        api.sendMessage(msg, event.threadID);
                      });
                    });
                    // var request = http.get(event.attachments[0].previewUrl, function(response) {
                    //   if(response){
                    //     response.pipe(file);
                    //     file.on('finish', function(){
                    //       var msg = {
                    //         attachment: fs.createReadStream('echo_photo.jpg')
                    //       }
                    //       api.sendMessage(msg, event.threadID);
                    //     });
                    //   }
                    // });
                  }
                }
              }
            }
          }
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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
