var login = require("facebook-chat-api");
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request'); 
var Crawler = require("crawler");
var http = require('http');

var imgs = [];
var sentences = [];

var webshot = require('webshot');

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

function callBotApi(command, callback){
  request.get('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
    if(error) {
      callback('');
    } else {
      callback(body);
    }
  });
}

function doAction(api){
  // fs.writeFileSync('botpage.json', JSON.stringify(api.getAppState()));
  // db.connectDB(function(res) {

  // });
api.setOptions({
  listenEvents: true,
});
var stopListening = api.listen(function(err, event) {
  if (err) {
    console.error(err);
  }
  if (event) {
    var dayBefore = 0;
    console.log(event);
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
          var mess = callBotApi('troi', function(result){
            api.sendMessage(result, event.threadID);  
          });
        }  else if(event.body.indexOf('/img') > -1){
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
        } else if(event.body.indexOf('/nt') > -1){
          api.markAsRead(event.threadID, function(err) {
            if (err) console.log(err);
          });
          var mess = callBotApi('nt', function(result){
            api.sendMessage(result, event.threadID);  
          });
        } else if(event.body.indexOf('/rau') > -1){
          api.markAsRead(event.threadID, function(err) {
            if (err) console.log(err);
          });
          var command = event.body.substring(1, event.body.length);
          var mess = callBotApi(command, function(result){
            console.log(result);
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
        } else if(event.body.indexOf('/nude') > -1){
          api.markAsRead(event.threadID, function(err) {
            if (err) console.log(err);
          });
          callBotApi('nude', function(result){
            var file = fs.createWriteStream("nude.jpg");
            var request = http.get(result, function(response) {
              if(response){
                response.pipe(file);
                file.on('finish', function(){
                  var msg = {
                    attachment: fs.createReadStream('nude.jpg')
                  }
                  api.sendMessage(msg, event.threadID);
                });
              }
            });
          });
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
