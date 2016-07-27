var Crawler = require("crawler");
var url = require('url');
var db = require('./db.js');

var urls = [];

db.getPokemonList(function(rows){
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var detailsUrl = 'http://pokemongo.gamepress.gg/pokemon/' + id;
        urls.push(detailsUrl);
    }
    c.queue(urls);
});

var c = new Crawler({
    maxConnections: 10,
    callback: function(error, result, $) {
        if($){
            $('tbody.list').find('tr').each(function(index, tr){
                $(tr).find('td').each(function(index, td){
                    var stardust, level, minCP, maxCP;
                    switch(index){
                        case 0:
                            stardust = $(td).text().trim();
                            break;
                        case 1:
                            level = $(td).text().trim();
                            break;
                        case 2:
                            minCP = $(td).text().trim();
                            break;
                        case 3:
                            maxCP = $(td).text().trim();
                            break;
                    }
                    var image = 'http://pokemongo.gamepress.gg/' + $('div.pokemon-image').find('img').attr('src');
                    var pokeId = image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('.'));
                    if(pokeId.indexOf('_') > -1){
                        pokeId = pokeId.substring(0, pokeId.lastIndexOf('_'));
                    }
                })
                console.log(pokeId + ', ' + stardust + ', ' + level + ', ' + minCP + ', ' + maxCP);
            })
        }
    }
});