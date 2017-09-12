'use strict';

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var greenlock = require('greenlock-express');

greenlock.create({
  server: 'https://acme-v01.api.letsencrypt.org/directory',
  email: 'duydkny@gmail.com',
  agreeTos: true,
  approveDomains: ['bu.1ly.co'],
  app: require('express')().use('/', function (req, res) {
    res.end('Hello, World!');
  })
}).listen(8080, 8443);


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
        var data = JSON.parse(result);
        var msg;
        if(data.status){
          if(data.status === 'accepted'){
            msg = 'Đây rồi \n'
            + 'Tài xế: ' + data.driver.name + '\n'
            + 'Số đt: ' + data.driver.phone_number + '\n'
            + 'Rating: ' + data.driver.rating + ' * \n'
            + 'Avatar: ' + data.driver.picture_url + '\n'
            + 'Xe: ' + data.vehicle.make + ' ' + data.vehicle.model + '\n'
            + 'Biển: ' + data.vehicle.license_plate + '\n'
            + 'Minh hoạ: ' + data.vehicle.picture_url + '\n'
            + 'Khoảng ' + data.pickup.eta + ' phút nữa thì đến \n'
            + 'Di chuyển mất khoảng ' + data.destination.eta + ' phút'
          } else {
            msg = 'Chưa thằng nào nhận. chờ đi'
          }
        } else {
          msg = 'Maintain now'
        }
        bot.sendMessage(message.chat.id, msg);
      });
    }
  }
});
