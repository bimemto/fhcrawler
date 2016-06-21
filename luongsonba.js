var YQL = require("yql");
var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var banquo = require('banquo');
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request');
var Crawler = require("crawler");
var webshot = require('webshot');

fs.exists('luongsonba.json', function(exists) {
	if (exists) {
		var appstate = JSON.parse(fs.readFileSync('luongsonba.json', 'utf8'));
		if(appstate){
			login({appState: appstate}, function callback (err, api) {
				if(err){
					switch (err.error) {
						case 'login-approval':
						console.log('Enter code > ');
						rl.on('line', function(line){
							err.continue(line);
							rl.close();
						});
						break;
					}
				}
				doAction(api);
			})} else {
				login({
					email: "vuatui.vn@gmail.com",
					password: "appota123456"
				}, function callback(err, api) {
					if(err){
						switch (err.error) {
							case 'login-approval':
							console.log('Enter code > ');
							rl.on('line', function(line){
								err.continue(line);
								rl.close();
							});
							break;
						}
					}
					fs.writeFileSync('luongsonba.json', JSON.stringify(api.getAppState()));
					doAction(api);
				});
			}
		} else {
			login({
				email: "vuatui.vn@gmail.com",
				password: "appota123456"
			}, function callback(err, api) {
				if(err){
					switch (err.error) {
						case 'login-approval':
						console.log('Enter code > ');
						rl.on('line', function(line){
							err.continue(line);
							rl.close();
						});
						break;
					}
				}
				fs.writeFileSync('luongsonba.json', JSON.stringify(api.getAppState()));
				doAction(api);
			});
		}
	});

var sentences = [];

function doAction(api){
	api.setOptions({
		listenEvents: true
	});
	var stopListening = api.listen(function(err, event) {
		if (err) {
			console.log(err);
		}
		if(event){
			if(event.body){
				console.log(event);
				var groupName, from;
				switch (event.type) {
					case "message":
					if (event.body === '/stop') {
						api.sendMessage("Goodbye...", event.threadID);
						return stopListening();
					} else if(event.body.indexOf('/nt') > -1){
						console.log(sentences.length);
						api.markAsRead(event.threadID, function(err) {
							if (err) console.log(err);
						});
						var msg = sentences[getRandomInt(0, sentences.length)];
						if(msg){
							console.log(msg);
							if(msg.indexOf('.') === 2){
								msg = msg.substring(3, msg.length);
								api.sendMessage(msg, event.threadID);	
							} else if(msg.indexOf('.') === 1){
								msg = msg.substring(2, msg.length);
								api.sendMessage(msg, event.threadID);
							} else {
								api.sendMessage(msg, event.threadID);
							}
						}
					} else if (event.body.indexOf('/kq') > -1) {
						api.markAsRead(event.threadID, function(err) {
							if (err) console.log(err);
						});
						var dayBefore = '';
						if (event.body.length > 4) {
							var dayStr = event.body.split(' ')[1];
							dayBefore = dayStr.substr(1, dayStr.length);
						}
						else {
							dayBefore = 0;
						}
						var timestamp = Math.floor(Date.now() / 1000);
						webshot('http://ketqua.vn/in-ve-so/22/1/' + getDateTime(dayBefore) + '/1', 'kqxs' + timestamp + '.png', function(err) {
							if(err){
								console.log(err);
							} else {
								var msg = {
									body: "Kết quả",
									attachment: fs.createReadStream('kqxs' + timestamp + '.png')
								}
								api.sendMessage(msg, event.threadID);
							}

						});
					} else if (event.body.indexOf('/tt') > -1) {
						api.markAsRead(event.threadID, function(err) {
							if (err) console.log(err);
						});
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
							api.sendMessage(weatherMsg + '\r\n' + forecastMsg, event.threadID);
						});
} else if(event.body.indexOf('/tho') > -1){
	api.markAsRead(event.threadID, function(err) {
		if (err) console.log(err);
	});
	var words = '';
	if (event.body.length > 5) {
		words = event.body.substring(event.body.indexOf(' ') + 1);
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
				var tho = $('font').attr('color', 'Blue').html().split('<br>').join('\r\n');
				api.sendMessage(tho, event.threadID);
			} else {
				api.sendMessage('Khó thế éo làm đc', event.threadID);
			}
		}
	});
}
break;
case "event":
console.log(event);
break;
}
}
}

});
}

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
					console.log(sentense);
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

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
	return arr[(val % 16)];
}