var CronJob = require('cron').CronJob;
var request = require('request');
var querystring = require('querystring');

var job = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    callVIPApi();
  },
  start: true,
});
job.start();

function callVIPApi(){
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url: 'https://apivip.gamota.com/site/login-appota',
    body: querystring.stringify(form)
  }, function(error, response, body){
    if(error){
      console.log(error);
      sendMessage('Login VIP tạch rồi \n' + error, "-237111661");
    } else {
      console.log(body);
    }
  })
}

function sendMessage(message, group_id){
  request.post({
    url: 'http://bu.1ly.co:9669/bot?messenger=telegram&group_id=' + group_id + '&content=' + message
  }, function(error, response, body){

  })
}
