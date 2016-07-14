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
	} else if(command.indexOf('rau') > -1){
		var type = '';
		var crawlUrl = '';
		if (command.length > 5) {
			type = command.substring(command.indexOf(' ') + 1);
		}
		if(type === 'vip'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-ha-noi-cao-cap.31/';
		} else if(type === 'kiemdinh'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-ha-noi-kiem-dinh.29/';
		} else if(type === 'tdh'){
			var urls = ["http://goihang.net/forums/tran-duy-hung-f1.18/", "http://goihang.net/forums/tran-duy-hung-f2.17/", "http://goihang.net/forums/tran-duy-hung-f3.19/", "http://goihang.net/forums/hang-choi-dem-tdh.20/"];
			crawlUrl = urls[getRandomInt(0, 3)];
		} else if(type === 'nkt'){
			var urls = ["http://goihang.net/forums/nguyen-khanh-toan-f1.35/", "http://goihang.net/forums/hang-choi-dem-nkt.39/", "http://goihang.net/forums/nguyen-khanh-toan-f2.38/", "http://goihang.net/forums/hoang-quoc-viet.37/"];
			crawlUrl = urls[getRandomInt(0, 3)];
		} else if(type === 'klm'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-chua-boc-klm.41/';
		} else if(type === 'tdt'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-kham-thien-ton-duc-thang.129/';
		} else if(type === 'hc'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-khu-vuc-hoang-cau.131/';
		} else if(type === 'quadem'){
			crawlUrl = 'http://goihang.net/forums/hang-choi-dem.45/';
		} else if(type === 'llq'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-lac-long-quan-au-co-nghi-tam.132/';
		} else if(type === 'lang'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-duong-lang-nguyen-khang.21/';
		} else if(type === 'lb'){
			crawlUrl = 'http://goihang.net/forums/pho-co-long-bien-gia-lam.42/';
		} else if(type === 'gb'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-kim-dong-giap-bat.134/';
		} else if(type === 'nts'){
			crawlUrl = 'http://goihang.net/forums/nga-tu-so-thanh-xuan.44/';
		} else if(type === 'cg'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-cau-giay-xuan-thuy.151/';
		} else if(type === 'htm'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-dinh-thon-ho-tung-mau.36/';
		} else if(type === 'new'){
			crawlUrl = 'http://goihang.net/forums/hang-moi-len-chua-kiem-dinh.32/';
		} else if(type === 'maybay'){
			crawlUrl = 'http://goihang.net/forums/may-bay-tm.27/';
		} else if(type === 'sgvip'){
			crawlUrl = 'http://goihang.net/forums/hang-cao-cap.120/';
		} else if(type === 'sgkiemdinh'){
			crawlUrl = 'http://goihang.net/forums/hang-kiem-dinh.119/';
		} else if(type === 'tanbinh'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-tan-binh-tan-phu.107/';
		} else if(type === 'q1' || type === 'q3' || type === 'q5'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-quan-1-3-5.105/';
		} else if(type === 'q2' || type === 'q9'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-quan-2-quan-9.110/';
		} else if(type === 'sgdem'){
			crawlUrl = 'http://goihang.net/forums/hang-choi-dem.113/';
		} else if(type === 'phunhuan'){
			crawlUrl = 'http://goihang.net/forums/quan-phu-nhuan-binh-thanh.114/';
		} else if(type === 'q6' || type === 'q10' || type === 'q11'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-quan-6-10-11.108/';
		} else if(type === 'q4' || type === 'q7' || type === 'q8'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-quan-4-7-8.106/';
		} else if(type === 'q12' || type === 'govap'){
			crawlUrl = 'http://goihang.net/forums/gai-goi-quan-12-go-vap.109/';
		} else if(type === 'sg'){
			crawlUrl = 'http://goihang.net/forums/cac-quan-huyen-khac.111/';
		} else {
			crawlUrl = 'http://goihang.net/forums/tran-duy-hung-f1.18/';
		}
		new Crawler({
			maxConnections: 10,
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
			callback: function(error, result, $) {
				if($){
					var root = $('ol.discussionListItems');
					var ol = root[getRandomInt(0, root.length - 1)];
					var hot = $(ol).find('li.discussionListItem.visible.sticky');
					var normal = $(ol).find('li.discussionListItem.visible');
					var hotItem = hot[getRandomInt(0, hot.length - 1)];
					var normalItem = normal[getRandomInt(0, normal.length - 1)];
					var result = [hotItem, normalItem];
					var resultItem = result[getRandomInt(0, 1)];
					var img = $(resultItem).find('img').attr('src');
					var title = $(resultItem).find('div.titleText').find('a.PreviewTooltip').text();
					var link = 'http://goihang.net/' + $(resultItem).find('div.titleText').find('a.PreviewTooltip').attr('href');
					var price = $(resultItem).find('div.titleText').find('a.prefixLink').find('span').text();
					message = price + '. ' + title + '\r\n' + link;
				} else {
					message = 'not available';
				}
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
	});
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