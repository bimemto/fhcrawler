var CronJob = require('cron').CronJob;
var crawler = require("./24h.js");
var job = new CronJob({
  cronTime: '00 30 21 * * 0-6',
  onTick: function() {
    crawler.crawl();
  },
  start: true,
});
job.start();