var Crawler = require("crawler");

var c = new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
        if($){
            $('p').each(function(index, p){
				//var p = $(span).find('p:not([class!=""])').each(function(index, p){
					var sentense = $(p).text();
					console.log(sentense);
					// if(sentence.indexOf('69') < 0){
					// 	sentences.push(sentense);	
					// }
				})
			//})
        }
    }
});

c.queue('http://danhngon.net/69-cau-noi-hay-trong-nhung-tieu-thuyet-ngon-tinh/');