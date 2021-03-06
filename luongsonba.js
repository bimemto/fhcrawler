var YQL = require("yql");
var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request');
var Crawler = require("crawler");
var webshot = require('webshot');
var TelegramBot = require('node-telegram-bot-api');

var filters = ["duy", "địp", "điệp", "bá", "khanh", "vân", "thảo"];
var allowedGroups = ['1133698873375433', '1084475338267713'];

var token = '269909258:AAHvYvt0a2gI7LRVJC1HVOIwvdxdLCkkJfc';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
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

function wordInString(s, word) {
  return new RegExp('\\b' + word + '\\b', 'i').test(s);
}

fs.exists('luongsonba.json', function(exists) {
	if (exists) {
		var appstate = JSON.parse(fs.readFileSync('luongsonba.json', 'utf8'));
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
					email: "vuatui.vn@gmail.com",
					password: "appota123456"
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
					fs.writeFileSync('luongsonba.json', JSON.stringify(api.getAppState()));
					doAction(api);
				});
			}
		} else {
			login({
				email: "vuatui.vn@gmail.com",
				password: "appota123456"
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
				fs.writeFileSync('luongsonba.json', JSON.stringify(api.getAppState()));
				doAction(api);
			});
		}
	});

var sentences = [];
//127321814
function doAction(api){
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
          //console.log(event.threadID + ": " + event.body);
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
          // api.markAsRead(event.threadID, function(err) {
          //   if (err) console.log(err);
          // });
          // var mess = callBotApi('img', function(result){
          //   var file = fs.createWriteStream("img.jpg");
          //   var request = http.get(result, function(response) {
          //     if(response){
          //       response.pipe(file);
          //       file.on('finish', function(){
          //         var msg = {
          //           attachment: fs.createReadStream('img.jpg')
          //         }
          //         api.sendMessage(msg, event.threadID);
          //       });
          //     }
          //   });
          // });
} else if(event.body.indexOf('/nt') > -1){
  api.markAsRead(event.threadID, function(err) {
    if (err) console.log(err);
  });
  var mess = callBotApi('nt', function(result){
    api.sendMessage(result, event.threadID);  
  });
} else if(event.body.indexOf('/rau') > -1){
          // api.markAsRead(event.threadID, function(err) {
          //   if (err) console.log(err);
          // });
          // var command = event.body.substring(1, event.body.length);
          // var mess = callBotApi(command, function(result){
          //   api.sendMessage(result, event.threadID);  
          // });
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
          body: "Kết quả",
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
} else {
  api.getThreadInfo(event.threadID, function(error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(info);
      groupName = info.name;
      var isGroup = event.isGroup;
      if (isGroup && allowedGroups.indexOf(event.threadID) > -1) {
        api.getUserInfo(event.senderID, function(error, info) {
          if (error) {
            console.log(error);
          }
          else {
            var from = 'Ahihi';
            for (var prop in info) {
              from = info[prop].name;
            }
            bot.sendMessage('127321814', groupName + '\r\n' + from + ': ' + event.body);
          }
        })
      }
    }
  });
}
} else {
  api.getThreadInfo(event.threadID, function(error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(info);
      groupName = info.name;
      var isGroup = event.isGroup;
      if (isGroup && allowedGroups.indexOf(event.threadID) > -1) {
        api.getUserInfo(event.senderID, function(error, info) {
          if (error) {
            console.log(error);
          }
          else {
            var from = 'Ahihi';
            for (var prop in info) {
              from = info[prop].name;
            }
            if(event.attachments.length > 0){
              if(event.attachments[0].type === 'photo'){
                bot.sendMessage('127321814', groupName + '\r\n' + from + ': ' + event.attachments[0].hiresUrl);
              } else if(event.attachments[0].type === 'animated_image'){
                bot.sendMessage('127321814', groupName + '\r\n' + from + ': ' + event.attachments[0].previewUrl);
              }
            }
          }
        })
      }
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
