var CronJob = require('cron').CronJob;
var request = require('request');

var job = new CronJob({
  cronTime: '0 */5 * * * *',
  onTick: function() {
    callApi();
  },
  start: true,
});
job.start();

function callApi() {
  request.get({
    url: 'https://apivip.gamota.com/site/mobile-configs'
  }, function(error, response, body){
    if(error){
      console.log(error);
      sendMessage('api VIP tạch rồi \n' + error, "-237111661");
    } else {
      console.log(body);
    }
  });
}

function sendMessage(message, group_id){
  request.post({
    url: 'http://bu.1ly.co:9669/bot?messenger=telegram&group_id=' + group_id + '&content=' + message
  }, function(error, response, body){

  })
}
