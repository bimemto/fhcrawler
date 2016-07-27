var Crawler = require("crawler");
var url = require('url');
var db = require('./db.js');

var baseAtk, baseDef, baseSta, captureRate, fleeRate, type;
var candy, hatchDistance;

var c = new Crawler({
    maxConnections : 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function (error, result, $) {
        if($){
            $('div.pokemon-stats').find('tr').each(function(index, tr){
                switch(index){
                    case 1:
                    baseAtk = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                    case 2:
                    baseDef = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                    case 3:
                    baseSta = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                    case 4:
                    captureRate = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                    case 5:
                    fleeRate = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                    case 6:
                    type = $(tr).find('td:not([class!=""])').text().trim();
                    break;
                }
            })

            $('div[id=evolution-requirements]').find('tr').each(function(index, tr){
                if(index === 0){
                    candy = $(tr).find('td:not([class!=""])').text().trim();
                } else {
                    hatchDistance = $(tr).find('td:not([class!=""])').text().trim();
                }
            })

            var image = 'http://pokemongo.gamepress.gg/' + $('div.pokemon-image').find('img').attr('src');
            var pokeId = image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('.'));
            if(pokeId.indexOf('_') > -1){
                pokeId = pokeId.substring(0, pokeId.lastIndexOf('_'));
            }
            db.insertPokeStats(pokeId, image, baseAtk, baseDef, baseSta, captureRate, fleeRate, type, candy, hatchDistance);
        }
    }
});

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

