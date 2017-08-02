var CronJob = require('cron').CronJob;
var crawler = require("./live_football.js");
var request = require('request');

var job = new CronJob({
  cronTime: '00 00 17 * * 1-6',
  onTick: function() {
    report1();
    report2();
  },
  start: true,
});
job.start();

report1 = function() {
  var now = new Date().getTime();
  var options = {
    method: 'POST',
    uri: 'https://api.checkin.appota.com:3001/api/mobile/staffs-report-project',
    form: {
      staffProjectID: '58ff09c1b8bb3251d0e16d34',
      ratio: '50',
      date: now
    },
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGM4YzEwOTExY2IwMTQ1OTU2MWYwNWYiLCJlbWFpbCI6ImR1eW5rQGFwcG90YS5jb20iLCJsYXN0TG9naW4iOjE1MDE2NDg2ODMwODgsImlhdCI6MTUwMTY0ODY4M30.ogFMhVtuEOI-a2qFBmer3kBS6yoFGVIGwWomfnADEUM'
    }
};
  request(options, function(error, response, body) {
    if(error){
      console.log(error);
    } else {
      console.log(response);
    }
  })
}

report2 = function() {
  var now = new Date().getTime();
  var options = {
    method: 'POST',
    uri: 'https://api.checkin.appota.com:3001/api/mobile/staffs-report-project',
    form: {
      staffProjectID: '58edb053b149cf79c879bda4',
      ratio: '50',
      date: now
    },
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGM4YzEwOTExY2IwMTQ1OTU2MWYwNWYiLCJlbWFpbCI6ImR1eW5rQGFwcG90YS5jb20iLCJsYXN0TG9naW4iOjE1MDE2NDg2ODMwODgsImlhdCI6MTUwMTY0ODY4M30.ogFMhVtuEOI-a2qFBmer3kBS6yoFGVIGwWomfnADEUM'
    }
};
  request(options, function(error, response, body) {
    if(error){
      console.log(error);
    } else {
      console.log(response);
    }
  })
}
