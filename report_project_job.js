var CronJob = require('cron').CronJob;
var request = require('request');
var moment = require('moment');

var job = new CronJob({
  cronTime: '00 00 17 * * 1-6',
  onTick: function() {
    report('58ff09c1b8bb3251d0e16d34');
    report('58edb053b149cf79c879bda4');
  },
  start: true,
});
job.start();

function report(projectId) {
  var now = moment().format();
  console.log(now);
  var form = {
    staffProjectID: projectId,
    ratio: '50',
    date: now
  };
  request.post({
    headers: {'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGM4YzEwOTExY2IwMTQ1OTU2MWYwNWYiLCJlbWFpbCI6ImR1eW5rQGFwcG90YS5jb20iLCJsYXN0TG9naW4iOjE1MDE2NjY1NDY3MDAsImlhdCI6MTUwMTY2NjU0Nn0.iOtKAhyUqdYUj9iwXQeydwWLUDJzyTl7JWRtOBWsmpo'},
    url: 'https://api.checkin.appota.com:3001/api/mobile/staffs-report-project',
    body: form,
    json: true
  }, function(error, response, body){
    if(error){
      console.log(error);
    } else {
      console.log(body);
    }
  });
}
