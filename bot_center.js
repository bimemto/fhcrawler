var YQL = require("yql");
var http = require('http');
var cheerio = require('cheerio');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request'); 
var CronJob = require('cron').CronJob;
var Crawler = require("crawler");
var express = require('express');
var app = express();

app.get('/bot/center',function(req, res){
	var command = req.param('command', null);
	console.log("command: = "+command);
	var message;
	if(command === 'troi'){
		message = '.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n.\r\n';
		res.send(message);
	} else if(command.indexOf('rau') > -1){
		var type = '';
		var crawlUrl = '';
		if (command.length > 4) {
			type = command.substring(command.indexOf(' ') + 1);
		}
		if(type === 'vip'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-hang-cao-cap-ha-noi.197/';
		} else if(type === 'hn'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-khu-vuc-noi-thanh-ha-noi.193/';
		} else if(type === 'tdh'){
			crawlUrl = "http://thiendia.com/diendan/forums/gai-goi-khu-tran-duy-hung-nguyen-thi-dinh.194/";
		} else if(type === 'nkt'){
			crawlUrl = "http://thiendia.com/diendan/forums/gai-goi-cau-giay-nguyen-khanh-toan-hqv.195/";
		} else if(type === 'quadem'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-di-dem-tai-ha-noi.220/';
		} else if(type === 'khac'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-khu-vuc-khac.196/';
		} else if(type === 'hp'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-khu-vuc-hai-phong.216/';
		} else if(type === 'video'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-ha-noi-co-video.223/';
		} else if(type === 'maybay'){
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-gia-re-va-may-bay-thuong-mai.206/';
		} else {
			crawlUrl = 'http://thiendia.com/diendan/forums/gai-goi-khu-tran-duy-hung-nguyen-thi-dinh.194/';
		}
		new Crawler({
			maxConnections: 10,
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
			callback: function(error, result, $) {
				if($){
					var root = $('ol.discussionListItems');
					var ol = root[1];
					if(ol === undefined || ol === 'undefined'){
						ol = root[0];
					}
					var items = $(ol).find('li.discussionListItem.visible');
					var item = items[getRandomInt(0, items.length - 1)];
					var place = $(item).find('span.prefix').text();
					var title = $(item).find('div.titleText').find('a.PreviewTooltip').text();
					var link = 'http://thiendia.com/diendan/' + $(item).find('div.titleText').find('a.PreviewTooltip').attr('href');
					var aPrice = $(item).find('div.titleText').find('a.prefixLink')[1];
					var price = $(aPrice).find('span').text();
					message = place + '. ' + price + '. ' + title + '\r\n' + link;
				} else {
					message = 'not available';
				}
				res.send(message);
			}
		}).queue(crawlUrl);
} else if(command === 'tt'){
	var query = new YQL("select * from weather.forecast where (woeid = 2347727) and u='c'");
	query.exec(function(err, data) {
		var location = data.query.results.channel.location;
		var wind = data.query.results.channel.wind;
		var condition = data.query.results.channel.item.condition;
		var forecast = data.query.results.channel.item.forecast;
		var forecastMsg = '';
		forecastMsg = 'Mai:' + '\r\n' + 'Cao: ' + forecast[0].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[0].low + ' độ xê' + '\r\n' + forecast[0].text + '\r\n' + '\r\n'
		+ 'Ngày kia:' + '\r\n' + 'Cao: ' + forecast[1].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[1].low + ' độ xê' + '\r\n' + forecast[1].text + '\r\n' + '\r\n'
		+ 'Ngày kìa:' + '\r\n' + 'Cao: ' + forecast[2].high + ' độ xê' + '\r\n' + 'Thấp: ' + forecast[2].low + ' độ xê' + '\r\n' + forecast[2].text + '\r\n';
		var weatherMsg = 'Bây giờ:' + '\r\n'
		+ condition.temp + ' độ xê' + '\r\n'
		+ 'Gió ' + degToCompass(wind.direction) + ' ' + wind.speed + ' km/h' + '\r\n'
		+ condition.text + '\r\n';
		message = weatherMsg + '\r\n' + forecastMsg;
		res.send(message);
	});
} else if(command.indexOf('tho') > -1){
	var words = '';
	if (command.length > 5) {
		words = command.substring(command.indexOf(' ') + 1);
	}
	request.post('http://thomay.vn/index.php?q=tutaochude2', 
		{form: {
			'dieukien_tu': '',
			'dieukien_tu_last': '',
			'fullbaitho': 'Thêm một khổ',
			'last': '',
			'order': '0',
			'order_cu': '0',
			'poem': '',
			'poemSubject_tutao': '1',
			'poemType': 'Lục bát',
			'theloai': 'tho',
			'tulap[cu]': '',
			'tulap[moi]': '',
			'tungcau_kho': '',
			'tunhap_chude': words,
			'van[cu]': '',
			'van[moi]': '',
		}
	}, function(error, response, body){
		if(error) {
			console.log(error);
		} else {
			var $ = cheerio.load(body, { decodeEntities: false });
			if($('font').attr('color', 'Blue').html()){
				message = $('font').attr('color', 'Blue').html().split('<br>').join('\r\n');
			} else {
				message = 'Khó thế éo làm đc';
			}
			res.send(message);
		}
	});
} else if(command === 'quay'){
	fs.readFile('quay.txt', 'utf8', function (err,data) {
		if (err) {
			console.log(err);
		} else {
			message = data;
		}
		res.send(message);
	});
} else if(command === 'img'){
	new Crawler({
		maxConnections: 10,
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
		callback: function(error, result, $) {
			if($){
				var divPost = $('div.posts.sub-gallery.br5.first-child').find('div.post');
				var item = divPost[getRandomInt(0, divPost.length - 1)];
				var id = $(item).attr('id');
				var details_url = 'http://imgur.com/r/nsfw/' + id;
				new Crawler({
					maxConnections: 10,
					userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
					callback: function(error, result, $) {
						if($){
							var img = $('div.post-image').find('img').attr('src');
							if(img === undefined || img === 'undefined' || img === ''){
								res.send('lil');
							} else {
								var url = 'http:' + img;
								res.send(url);
							}
						}
					}
				}).queue(details_url);
			}
		}
	}).queue('http://imgur.com/r/nsfw');
} else if(command === 'nt'){
	var msg = sentences[getRandomInt(0, sentences.length)];
	if(msg){
		if(msg.indexOf('.') === 2){
			msg = msg.substring(3, msg.length);
		} else if(msg.indexOf('.') === 1){
			msg = msg.substring(2, msg.length);
		}
		res.send(msg);
	} else {
		res.send('');
	}
} else if(command.indexOf('kq') > -1){
	var dayBefore = '';
	if (command.length > 4) {
		var dayStr = command.split(' ')[1];
		dayBefore = dayStr.substr(1, dayStr.length);
	}
	else {
		dayBefore = 0;
	}
	var timestamp = Math.floor(Date.now() / 1000);
	var kqUrl = 'http://ketqua.vn/in-ve-so/22/1/' + getDateTime(dayBefore) + '/1';
	res.send(kqUrl);
}
});

var server = app.listen(6868, function() {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port);
})

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
	return arr[(val % 16)];
}

var sentences = [];

var c = new Crawler({
	maxConnections: 10,
	callback: function(error, result, $) {
		if($){
			$('div.post-content.description').each(function(index, div){
				var p = $(div).find('p:not([class!=""])').each(function(index, p){
					var sentense = $(p).text();
					if(sentense.indexOf('{') < 0){
						sentences.push(sentense); 
					}
				})
			})
		}
	}
});

var c1 = new Crawler({
	maxConnections: 10,
	callback: function(error, result, $) {
		if($){
			$('div.entry-content').each(function(index, div){
				var p = $(div).find('p:not([class!=""])').each(function(index, p){
					var sentense = $(p).find('em:not([class!=""])').text();
					sentences.push(sentense); 
				})
			})
		}
	}
});

var c2 = new Crawler({
	maxConnections: 10,
	userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
	callback: function(error, result, $) {
		if($){
			$('span[itemprop=articleBody]').each(function(index, span){
				var p = $(span).find('p:not([class!=""])').each(function(index, p){
					var sentense = $(p).text();
					if(sentense.indexOf('69') < 0){
						sentences.push(sentense); 
					}
				})
			})
		}
	}
});

c.queue('http://blogtraitim.info/nhung-cau-noi-bat-hu-hay-nhat-trong-tieu-thuyet-ngon-tinh/');

c1.queue('http://chiemtinhhoc.vn/tuyen-tap-nhung-cau-noi-hay-trong-tieu-thuyet-ngon-tinh/');
c1.queue('https://mannhuocbao.wordpress.com/2013/09/03/mot-so-cau-noi-hay-trong-ngon-tinh-1/');

c2.queue('http://danhngon.net/69-cau-noi-hay-trong-nhung-tieu-thuyet-ngon-tinh/');

function getDateTime(dayBefore) {

	var date = new Date();

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day = date.getDate() - dayBefore;
	day = (day < 10 ? "0" : "") + day;

	return year + "-" + month + "-" + day;

}