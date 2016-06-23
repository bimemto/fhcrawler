var CronJob = require('cron').CronJob;
var crawler = require("./live_football.js");
var job = new CronJob({
  cronTime: '0 0 * * * *',
  onTick: function() {
    crawler.crawl();
  },
  start: true,
});
job.start();