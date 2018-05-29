var CronJob = require('cron').CronJob;
var request = require('request');
var querystring = require('querystring');

var job = new CronJob({
  cronTime: '0 */5 * * * *',
  onTick: function() {
    loginGamota();
  },
  start: true,
});
job.start();

function loginGamota() {
  var form = {
    username: 'buontuoitoa',
    password: 'smilelife',
    device_id: '02:00:00:00:00:00',
    device_os: 'android',
    device_os_version: '7.1.2',
    client_version: '1.0'
  };
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url: 'https://api.gamota.com/game/login?api_key=K-A204613-U00000-8FTQB7-A3EB7082C754EFD8&lang=en',
    body: querystring.stringify(form)
  }, function(error, response, body){
    if(error){
      console.log(error);
      sendMessage('Login game tạch rồi \n' + error, "-237111661");
    } else {
      console.log(body);
      loginVIP(JSON.parse(body).access_token);
    }
  });
}

function loginVIP(token){
  console.log(token);
  var form = {
    appota_token: token
  };
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
