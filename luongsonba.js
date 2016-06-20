var login = require("facebook-chat-api");
var http = require('http');
var cheerio = require('cheerio');
var fs = require("fs");
var request = require('request');
var Crawler = require("crawler");

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
				}
				break;
				case "event":
				console.log(event);
				break;
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