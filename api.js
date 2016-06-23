var Crawler = require("crawler");
var fs = require("fs");
var http = require("http");

// new Crawler({
// 	maxConnections: 10,
// 	userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
// 	callback: function(error, result, $) {
// 		if($){
// 			$('div.posts.sub-gallery.br5.first-child').find('div.post').each(function(index, div){
// 				var id = $(div).attr('id');
// 				var details_url = 'http://imgur.com/r/nsfw/' + id;
// 				console.log('details', details_url);
// 				new Crawler({
// 					maxConnections: 10,
// 					userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
// 					callback: function(error, result, $) {
// 						if($){
// 							var img = $('div.post-image').find('img').attr('src');
// 							console.log(img);
// 						}
// 					}
// 				}).queue(details_url);
// 			})
// 		}
// 	}
// }).queue('http://imgur.com/r/nsfw');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var c3 = new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
      if($){
        var divPost = $('div.posts.sub-gallery.br5.first-child').find('div.post');
        var item = divPost[getRandomInt(0, divPost.length - 1)];
        var id = $(item).attr('id');
        console.log('hehe: ', id);
        $('div.posts.sub-gallery.br5.first-child').find('div.post').each(function(index, div){
    //       var id = $(div).attr('id');
    //       var details_url = 'http://imgur.com/r/nsfw/' + id;
    //       new Crawler({
    //         maxConnections: 10,
    //         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    //         callback: function(error, result, $) {
    //           if($){
    //             var img = $('div.post-image').find('img').attr('src');
    //             if(img === undefined || img === 'undefined' || img === ''){

    //             } else {
    //               img = img.substring(2, img.length);
    //               imgs.push(img);
    //           }
    //       }
    //   	}
  		// }).queue(details_url);
      })
    }
}
});

c3.queue('http://imgur.com/r/nsfw');

// var c = new Crawler({
//     maxConnections: 10,
//     userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
//     callback: function(error, result, $) {
//         if($){
//             $('p').each(function(index, p){
// 				//var p = $(span).find('p:not([class!=""])').each(function(index, p){
// 					var sentense = $(p).text();
// 					console.log(sentense);
// 					// if(sentence.indexOf('69') < 0){
// 					// 	sentences.push(sentense);	
// 					// }
// 				})
// 			//})
//         }
//     }
// });

// c.queue('http://danhngon.net/69-cau-noi-hay-trong-nhung-tieu-thuyet-ngon-tinh/');