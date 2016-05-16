'use strict'

var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var TelegramBot = require('node-telegram-bot-api');

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

var filters = ["duy", "Duy Khánh", "android", "salem"];

login({
  email: "duydkny@gmail.com",
  password: "4gA9NRfs4inxeWcmY4"
}, function callback(err, api) {
  if (err) {
    return console.error(err);
  }
  api.setOptions({
    listenEvents: true
  });
  var stopListening = api.listen(function(err, event) {
    if (err) {
      console.error(err);
    }
    console.log(event);
    var groupName, from;
    switch (event.type) {
      case "message":
        if (event.body === '/stop') {
          api.sendMessage("Goodbye...", event.threadID);
          return stopListening();
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
                  groupName = info.name;
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
              });

            }
          }
        }
        break;
      case "event":
        console.log(event);
        break;
    }
  });

});

function wordInString(s, word) {
  return new RegExp('\\b' + word + '\\b', 'i').test(s);
}
