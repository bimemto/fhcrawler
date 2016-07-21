var Crawler = require("crawler");
var db = require("./db.js");

db.connectDB(function(result) {
	db.getAllPokemon(function(error, rows){
		if(error){
			console.log(error);
		} else {
			for (var i = 0; i < rows.length; i++) {
				var name = rows[i].name;
				var detailsUrl = 'https://pokemonshowdown.com/dex/pokemon/' + name.toLowerCase();
				new Crawler({
					maxConnections: 10,
					userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
					callback: function(error, result, $) {
						if($){
							var id = $('div.pfx-panel').find('code:not([class!=""])').text();
							var height = $('dl.sizeentry').find('dd:not([class!=""])').text();
							var abilities = $('dl.abilityentry').find('dd.imgentry').find('a');
							var skills = '';
							for (var i = 0; i < abilities.length; i++){
								if($(a).find('em')){
									skill = skill + $(a).find('em').text();
								} else {
									skill = skill + $(a).text();
								}
							}
							var tds = $('table.stats').find('td.stat');
							var hpStat = tds[0];
							var hp = $(hpStat).text();
							var evos = $('table.evos').find('a');
							var evolution = '';
							for(var i = 0; i < evos.length; i++){
								evolution = i + "." + $(evos[i]).text();
							}
							console.log(id + ", " + height + ", " + skills + ", " + hp + ", " + evolution);
						}  
					}
				}).queue(detailsUrl);
			}
		}
	});
});