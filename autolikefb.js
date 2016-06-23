var FB = require('fb');
var CronJob = require('cron').CronJob;

var accessToken = 'EAACEdEose0cBANZA2odJUnyV7EYfDGC7UAhHpGrW1wu6NEBnnqdP51nmjmVUKzVJ7ZC901MAOrfqM4rhtZAfapcn4m51sWZAUa3o1lIZAM6mmF7IiqEVZB697vQTZCGTVcjAQesS2oZAZBTn25AZCSnyTeTv2qRYtcytTVkbbZBuMi04lp1ZBrSOsNped0oBkZBhRI5MZD';

FB.setAccessToken(accessToken);

function run(){
  var posts = [];
  FB.api('me/home', function (res) {
    if(!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     return;
   }
   var data = res.data;
   for(var i = 0; i < data.length; i++){
    var postId = data[i].id;
    var category = data[i].from.category;
    console.log(category + ": " + postId);
    if(category === undefined || category === 'undefined'){
      posts.push(postId);
    }
  }
  posts.forEach(function(post_id) {
    FB.api(post_id + '/likes', 'post', function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Liked post: ' + post_id + ": " + res);
    });
  });
});
}

new CronJob('*/5 * * * * *', function() {
  run();
}, null, true);


