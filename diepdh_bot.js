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

var token = '221326717:AAFywbKelgnmUOigfDpRbCCCyrX_HfTbzK4';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var webshot = require('webshot');


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
   if(message.text.indexOf('/fc') > -1){
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
  }
}
});

var job = new CronJob({
  cronTime: '00 00 07 * * 0-6',
  onTick: function() {
    db.getSentence1(function(error, rows){
      if (error) {
        console.log(error);
      } else {
        var message = rows[0].Text;
        bot.sendMessage('-41541244', message);  
      }
    });
  },
  start: true,
});
job.start();

var job1 = new CronJob({
  cronTime: '00 01 07 * * 0-6',
  onTick: function() {
    db.getSentence2(function(error, rows){
      if (error) {
        console.log(error);
      } else {
        var message = rows[0].Text;
        bot.sendMessage('-41541244', message);  
      }
    });
  },
  start: true,
});
job1.start();

function degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
  return arr[(val % 16)];
}
