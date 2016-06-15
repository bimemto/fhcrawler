var CronJob = require('cron').CronJob;
var crawler = require("./live_football.js");
var job = new CronJob({
  cronTime: '00 45 19 * * 0-6',
  onTick: function() {
    crawler.crawl();
  },
  start: true,
});
job.start();