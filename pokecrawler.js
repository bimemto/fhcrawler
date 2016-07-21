var Crawler = require("crawler");
var db = require("./db.js");

var c = new Crawler({
	maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
    	if($){
    		$('span.infocard-tall').each(function(index, div){
    			var id = $(div).find('small:not([class!=""])').text();
    			var name = $(div).find('a.ent-name').text();
    			var types = $(div).find('a.itype');
    			var type1 = types[0];
    			var type2 = types[1];
    			var type;
    			if(type2 === '' || type2 === "" || $(type2).length === 0){
    				type = $(type1).text();
    			} else {
    				type = $(type1).text() + '-' + $(type2).text();	
    			}
    			var image = 'https://img.pokemondb.net/artwork/' + name.toLowerCase() + '.jpg';
    			var generation;
                var idInt = id.substring(1, id.length);
                if(idInt >= 1 && idInt <= 151){
                    generation = 1;
                } else if(idInt > 151 && idInt <= 251){
                    generation = 2;
                } else if(idInt > 251 && idInt <= 386){
                    generation = 3;
                } else if(idInt > 386 && idInt <= 493){
                    generation = 4;
                } else if(idInt > 493 && idInt <= 649){
                    generation = 5;
                } else {
                    generation = 6;
                }
   				db.insertPokemon(id, name, image, type, generation);
   			})
    	} else {
    		console.log('lol');
    	}    
    }
});

//c.queue('http://pokemondb.net/pokedex/national');

db.connectDB(function(result) {
	c.queue('http://pokemondb.net/pokedex/national');
});