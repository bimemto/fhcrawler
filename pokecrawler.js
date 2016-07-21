var Crawler = require("crawler");
var mysql = require('mysql');

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
    			//console.log(id + ", " + name + ", " + image + ", " + type);
   				db.insertPokemon(id, name, image, type);
   			})
    	} else {
    		console.log('lol');
    	}    
    }
});

//c.queue('http://pokemondb.net/pokedex/national');

connectDB(function(result) {
	c.queue('http://pokemondb.net/pokedex/national');
});

var db_config = {
    host: '103.53.170.173',
    user: 'duynk',
    password: 'smilelife',
    database: 'Pokedex'
};

var connection;

function connectDB(callback) {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    connection.connect(function(error, result){
        if(error){
            console.log('error when connecting to db:', error);
        } else {
            console.log('connected to db', result);
            callback(result);  
        }
    });
};