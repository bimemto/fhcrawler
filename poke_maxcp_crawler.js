var Crawler = require("crawler");
var url = require('url');
var db = require('./db.js');

var c = new Crawler({
    maxConnections: 10,
    callback: function(error, result, $) {
        if($){
        	$('tbody').find('tr').each(function(index, tr){
        		var id = $(tr).find('td.views-field.views-field-field-pokemon-number.is-active.views-align-center').text();
        		var name = $(tr).find('td.views-field.views-field-field-pokemon-image.views-field-title').find('a[hreflang=en]').text();
        		var maxCP = $(tr).find('td.views-field.views-field-field-pokemon-max-cp').text();
        		db.insertPokemon(id.trim(), name, maxCP);
        	})
        }
    }
});

c.queue('http://pokemongo.gamepress.gg/pokemon-list');