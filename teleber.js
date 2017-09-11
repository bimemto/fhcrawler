var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var fareId = '';

function callBotApi(command, callback){
  request.get('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
    if(error) {
      callback('');
    } else {
      callback(body);
    }
  });
}
//RhYyGJnOQo5VEgvy3HPaexA0YJlLlz#_
bot.on('message', function(message) {
  var chat_id = message.chat.id;
  console.log(message);
  if(message.text){
    if(message.text === '/pes_estimate'){
      callBotApi('pes_estimate', function(result){
        var data = JSON.parse(result);
        var msg = 'Đi MAT \n'
                  + 'Giá : ' + data.fare.display + ' \n'
                  + 'Xe cách ' + data.pickup_estimate + ' phút'
        fareId = data.fare.fare_id;
        bot.sendMessage(message.chat.id, msg);
      });
    } else if(message.text === '/pes_go') {
      callBotApi('pes_go|' + fareId, function(result){
        var data = JSON.parse(result);
        var msg;
        if(data.status === 'processing'){
          msg = 'OK. Đợi tài xế nào'
        } else {
          msg = 'Maintain now'
        }
        bot.sendMessage(message.chat.id, msg);
      });
    } else if(message.text === '/pes_status') {
      callBotApi('pes_status', function(result){
        // var data = JSON.parse(result);
        // var msg = 'Đi MAT \n'
        //           + 'Giá : ' + data.fare.display + ' \n'
        //           + 'Xe cách' + data.pickup_estimate + ' phút'
        // bot.sendMessage(message.chat.id, msg);
      });
    }
  }
});
