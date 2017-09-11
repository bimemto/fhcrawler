var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
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

bot.on('message', function(message) {
  var chat_id = message.chat.id;
  console.log(message);
  if(message.text){
    if(message.text.indexOf('/pes') > -1){
      callBotApi('pes', function(result){
        //bot.sendMessage(message.chat.id, result);
        console.log('fack ', result);
      });
    } else if(message.text.indexOf('/tho') > -1){
      callBotApi('tho', function(result){
        //bot.sendMessage(message.chat.id, result);
        console.log('lol ', result);
      });
    }
  }
});
