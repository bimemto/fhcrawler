'use strict';

var YQL = require("yql");
var http = require('http');
var moment = require('moment');
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
var googl = require('goo.gl');
var _ = require('underscore');
googl.setKey('AIzaSyC2wTIH9KqiD4PGRPpk0DiGmYdDrB8lgUo');
googl.getKey();
var aes256cbc = require('./aes256cbc.js')

var sandbox = true;

function allowCrossDomain(req, res, next) {
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	var origin = req.headers.origin;
	if (_.contains(app.get('allowed_origins'), origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}

app.configure(function () {
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(allowCrossDomain);
});

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
					// Shorten a long url and output the result
					googl.shorten(link)
					.then(function (shortUrl) {
						shortUrl = shortUrl + 'xxx';
						message = place + '. ' + price + '. ' + title + '\r\n' + shortUrl;
						res.send(message);
					})
					.catch(function (err) {
						message = 'not available';
						res.send(message);
					});
				} else {
					message = 'not available';
					res.send(message);
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
} else if(command === 'tnl'){
	var url = 'http://truyenvkl.com/tag/truyen-sex-ngan-hay/page/' + getRandomInt(1, 16);
	new Crawler({
		maxConnections: 10,
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
		callback: function(error, result, $) {
			if($){
				var items = $('div.content-loop').find('article');
				var item = items[getRandomInt(0, items.length - 1)];
				var link = $(item).find('div.post-thumb').find('a').attr('href');
				var title = $(item).find('h1.entry-title').text();
				var desc = $(item).find('div.entry-excerpt').text();
				var message = title + '\r\n' + desc + '\r\n' + link;
				res.send(message);
			} else {
				res.send('ahihi');
			}
		}
	}).queue(url);
} else if(command === 'nude'){
	var thana = 'https://www.flickr.com/photos/thanatosgio/page' + getRandomInt(1, 171);
	var lumina = 'https://www.flickr.com/photos/138808430@N02/page' + getRandomInt(1, 11);
	var locphu = 'https://www.flickr.com/photos/129889617@N08/page' + getRandomInt(1, 14);
	var urls = ["https://www.flickr.com/photos/giangrua/", "https://www.flickr.com/photos/87122923@N03/", thana, lumina, locphu, "https://www.flickr.com/photos/141064724@N04/"];
	var urlToQueue = urls[getRandomInt(0, urls.length - 1)];
	new Crawler({
		maxConnections: 10,
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
		callback: function(error, result, $) {
			if($){
				var items = $('div.view.photo-list-view.requiredToShowOnServer.photostream').find('div.view.photo-list-photo-view.requiredToShowOnServer.photostream.awake');
				var item = items[getRandomInt(0, items.length - 1)];
				var style = $(item).attr('style');
				var attrs = style.toString().split(";");
				for(var i = 0; i < attrs.length; i++){
					if(attrs[i].indexOf('background-image') > -1){
						var link = attrs[i].toString().split(":")[1];
						var imageUrl = 'http://' + link.substring(7, link.length - 1);
						res.send(imageUrl);
						break;
					}
				}
			} else {
				res.send('ahihi');
			}
		}
	}).queue(urlToQueue);
} else if(command === 'pes_estimate') {
  var requestData = {
		product_id: '4e6b60d5-8e3a-4772-86b5-324d09b0ce39',
		start_latitude: '21.019459',
		start_longitude: '105.817133',
		end_latitude: '21.018828',
		end_longitude: '105.818970',
		seat_count: '1',
		start_address: '57 Láng Hạ',
		end_address: '192 Mai Anh Tuấn'
	}
	var endpoint = sandbox ? 'https://sandbox-api.uber.com/v1.2/requests/estimate' : 'https://api.uber.com/v1.2/requests/estimate';
	console.log('endpoint: ' + endpoint);
	request({
    headers: {
      'Authorization': 'Bearer KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IlprMmFLK3FMUnltV0dlOHJPbnhGTlE9PSIsImV4cGlyZXNfYXQiOjE1MDc3MTc1MzUsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.rgA8fdbOQ5IL5QU1G_G5WUXQ6FkxGe_LQHDCh__E6Dg',
      'Content-Type': 'application/json',
			'Accepted-Language': 'en_US'
    },
		json: requestData,
    uri: endpoint,
    method: 'POST'
  }, function (err, response, body) {
    //it works!
		if(err){
			console.log(err);
		} else {
			res.send(body);
			console.log('lol ', body);
		}
  });
} else if(command.indexOf('pes_go') > -1){
	var requestData = {
		product_id: '4e6b60d5-8e3a-4772-86b5-324d09b0ce39',
		start_latitude: '21.019459',
		start_longitude: '105.817133',
		end_latitude: '21.018828',
		end_longitude: '105.818970',
		seat_count: '1',
		fare_id: command.split("|")[1],
		start_address: '57 Láng Hạ',
		end_address: '192 Mai Anh Tuấn'
	}
	var endpoint = sandbox ? 'https://sandbox-api.uber.com/v1.2/requests' : 'https://api.uber.com/v1.2/requests';
	request({
    headers: {
      'Authorization': 'Bearer KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IlprMmFLK3FMUnltV0dlOHJPbnhGTlE9PSIsImV4cGlyZXNfYXQiOjE1MDc3MTc1MzUsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.rgA8fdbOQ5IL5QU1G_G5WUXQ6FkxGe_LQHDCh__E6Dg',
      'Content-Type': 'application/json'
    },
		json: requestData,
    uri: endpoint,
    method: 'POST'
  }, function (err, response, body) {
    //it works!
		if(err){
			console.log(err);
		} else {
			res.send(body);
			console.log('lol ', body);
		}
  });
} else if(command === 'pes_status'){
	var endpoint = sandbox ? 'https://sandbox-api.uber.com/v1.2/requests/current' : 'https://api.uber.com/v1.2/requests/current';
	request({
		headers: {
      'Authorization': 'Bearer KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IlprMmFLK3FMUnltV0dlOHJPbnhGTlE9PSIsImV4cGlyZXNfYXQiOjE1MDc3MTc1MzUsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.rgA8fdbOQ5IL5QU1G_G5WUXQ6FkxGe_LQHDCh__E6Dg',
    },
		uri: endpoint,
		method: 'GET'
	}, function(err, response, body){
		if(err){
			console.log(err);
		} else {
			res.send(body);
			console.log('lol ', body);
		}
	})
} else if(command === 'gccu'){
	//TODO call ccu api
	var gameId = '';
	if (command.length > 6) {
		gameId = command.substring(command.indexOf(' ') + 1);
	}
	var apiUrl = "https://track-sdk.gamota.com/api/ccu/";
	var start = moment().startOf('day').unix(); // set to 12:00 am today
	var end = moment().endOf('day').unix(); // set to 23:59 pm today
	var now = moment().unix();
	var requestData = {
		gameID: gameId,
		startTime: start,
		endTime: end,
		iTime: now
	}
	var requestStr = JSON.stringify(requestData);
	var token = aes256cbc.encrypt(requestStr);
	request.get(apiUrl + token, function(error, response, body){
    if(error) {
      console.log('eRror: ' + error);
    } else {
      console.log('body: ' + body);
    }
  });
}
});



var https = require('https');
// Set up express server here
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(require('helmet')());
var options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/bu.1ly.co/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/bu.1ly.co/privkey.pem')
};
app.listen(6868);
https.createServer(options, app).listen(8443);

app.post('/uber/hook', function(request, response){
	var status = request.body.meta.status;
	var xUberSig = request.headers['x-uber-signature'];
	console.log('signature: ', xUberSig);
	if(request.body.event_type === 'requests.status_changed'){
		if(status === 'accepted'){
			bot.sendMessage(chatId, 'Yay! Có thằng nhận rồi')
			callBotApi('pes_status', function(result){
        var data = JSON.parse(result);
        var msg;
        if(data.status){
          if(data.status === 'accepted'){
            msg = 'Đây rồi \n'
            + 'Tài xế: ' + data.driver.name + '\n'
            + 'Số đt: ' + data.driver.phone_number + '\n'
            + 'Rating: ' + data.driver.rating + ' * \n'
            + 'Avatar: ' + data.driver.picture_url + '\n'
            + 'Xe: ' + data.vehicle.make + ' ' + data.vehicle.model + '\n'
            + 'Biển: ' + data.vehicle.license_plate + '\n'
            + 'Minh hoạ: ' + data.vehicle.picture_url + '\n'
            + 'Khoảng ' + data.pickup.eta + ' phút nữa thì đến \n'
            + 'Di chuyển mất khoảng ' + data.destination.eta + ' phút'
          } else {
            msg = 'Chưa thằng nào nhận. chờ đi'
          }
        } else {
          msg = 'Maintain now'
        }
        bot.sendMessage(chatId, msg);
      });
		} else if(status === 'processing'){
			bot.sendMessage(chatId, 'Chưa có thằng nào nhận. Chờ đi')
		} else if(status === 'arriving'){
			bot.sendMessage(chatId, 'Xe đến rồi')
		} else if(status === 'driver_canceled'){
			bot.sendMessage(chatId, 'Thằng khốn nạn nó huỷ rồi')
		} else if(status === 'completed'){
			bot.sendMessage(chatId, 'Đến nơi rồi')
		} else if(status === 'rider_canceled'){
			bot.sendMessage(chatId, 'Đã huỷ')
		}
	}
	response.status(200).send('OK');
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

app.get('/euro/api/match_list', function(req, res) {
	db.getMatchList(function(rows) {
		var data = [];
		for (var i = 0; i < rows.length; i++) {
			var team_home = rows[i].team_home;
			var team_away = rows[i].team_away;
			var logo_home = rows[i].logo_home;
			var logo_away = rows[i].logo_away;
			var time = rows[i].time;
			var league = rows[i].league;
			var details_url = rows[i].details_url;
			data[i] = {team_home: team_home, team_away: team_away, logo_home: logo_home, logo_away: logo_away, time: time, league: league, details_url: details_url};
		}
		res.send(data);
	});
})

app.get('/uber/sandbox', function(req, res){
	var value = req.param('value');
	if(value === 'true'){
		sandbox = true;
	} else {
		sandbox = false;
	}
	res.status(200).send('sandbox: ' + sandbox);
})

app.get('/euro/api/get_live_url', function(req, res){
	var details_url = req.param('details_url');
	var server = req.param('server');
	res.header("Access-Control-Allow-Origin", "*");
	if(server === undefined || server === 'undefined'){
		server = 1;
	}
	new Crawler({
		maxConnections: 10,
		callback: function(error, result, $){
			if($){
				var iframe1Url = $('iframe').attr('src');
				if(iframe1Url){
					var link_crawler = new Crawler({
						maxConnections: 10,
						callback: function(error, result, $){
							if($){
								var iframe2Url = $('iframe').attr('src');
								console.log('ahihi', iframe2Url);
								if(iframe2Url){
									if(iframe2Url.indexOf('youtube.com') > -1  || iframe2Url.indexOf('http://tv.keonhacai.com/talk.php') > -1){
										if(iframe2Url.lastIndexOf('//', 0) === 0){
											iframe2Url = 'http:' + iframe2Url;
										}
										var data = {live_url: iframe2Url};
										res.send(data);
									} else if(iframe2Url.indexOf('sportstream365.com') > -1){
										iframe2Url = 'http:' + iframe2Url;
										var data = {live_url: iframe2Url};
										res.send(data);
									}  else {
										if(iframe2Url.indexOf('http://tv.keonhacai.com/hot') > -1){
											iframe2Url = 'http://tv.keonhacai.com/hot/k1_' + server + ".php";
										}
										link_crawler.queue(iframe2Url);
									}
								} else {
									var data = {live_url: ''};
									res.send(data);
								}
							} else {
								var data = {live_url: ''};
								res.send(data);
							}
						}
					});
					link_crawler.queue(iframe1Url);
				} else {
					var data = {live_url: ''};
					res.send(data);
				}
			} else {
				var data = {live_url: ''};
				res.send(data);
			}
		}
	}).queue(details_url);
})

//client teleber
var TelegramBot = require('node-telegram-bot-api');

var token = '208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

var fareId = '';
var chatId = '';

function callBotApi(command, callback){
  request.get('http://bu.1ly.co:6868/bot/center?command=' + command, function(error, response, body){
    if(error) {
      callback('');
    } else {
      callback(body);
    }
  });
}
//RhYyGJnOQo5VEgvy3HPaexA0YJlLlz#_
bot.on('message', function(message) {
  chatId = message.chat.id;
  console.log('lol: ', message);
  if(message.text){
    if(message.text.indexOf('/pes_estimate') > -1){
      callBotApi('pes_estimate', function(result){
        var data = JSON.parse(result);
        var msg = 'Đi MAT \n'
        + 'Giá : ' + data.fare.display + ' \n'
        + 'Xe cách ' + data.pickup_estimate + ' phút'
        fareId = data.fare.fare_id;
        bot.sendMessage(chatId, msg);
      });
    } else if(message.text.indexOf('/pes_go') > -1) {
      callBotApi('pes_go|' + fareId, function(result){
        var data = JSON.parse(result);
        var msg;
        if(data.status === 'processing'){
          msg = 'OK. Đợi tài xế nào'
        } else {
          msg = 'Maintain now'
        }
        bot.sendMessage(chatId, msg);
      });
    } else if(message.text.indexOf('/pes_status') > -1) {
      callBotApi('pes_status', function(result){
        var data = JSON.parse(result);
        var msg;
        if(data.status){
          if(data.status === 'accepted'){
            msg = 'Đây rồi \n'
            + 'Tài xế: ' + data.driver.name + '\n'
            + 'Số đt: ' + data.driver.phone_number + '\n'
            + 'Rating: ' + data.driver.rating + ' * \n'
            + 'Avatar: ' + data.driver.picture_url + '\n'
            + 'Xe: ' + data.vehicle.make + ' ' + data.vehicle.model + '\n'
            + 'Biển: ' + data.vehicle.license_plate + '\n'
            + 'Minh hoạ: ' + data.vehicle.picture_url + '\n'
            + 'Khoảng ' + data.pickup.eta + ' phút nữa thì đến \n'
            + 'Di chuyển mất khoảng ' + data.destination.eta + ' phút'
          } else {
            msg = 'Chưa thằng nào nhận. chờ đi'
          }
        } else {
          msg = 'Maintain now'
        }
        bot.sendMessage(chatId, msg);
      });
    }
  }
});
