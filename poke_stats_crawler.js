var Crawler = require("crawler");
var url = require('url');
var db = require('./db.js');

var baseAtk, baseDef, baseSta, captureRate, fleeRate, type;
var candy, hatchDistance;

var urls = [];

db.getPokemonList(function(rows){
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var detailsUrl = 'http://pokemongo.gamepress.gg/pokemon/' + id;
        urls.push(detailsUrl);
    }
    new Crawler({
            maxConnections: 10,
            callback: function(error, result, $) {
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
                    //console.log(id + ', ' + baseAtk + ', ' + baseDef + ', ' + baseSta + ', ' + captureRate + ', ' + fleeRate + ', ' + type + ', '+ candy + ', ' + hatchDistance);
                    var pokeId = detailsUrl.substring(detailsUrl.lastIndexOf('/') + 1, detailsUrl.length);
                    console.log(pokeId);
                    //db.insertPokeStats(id, baseAtk, baseDef, baseSta, captureRate, fleeRate, type, candy, hatchDistance);
                }
            }
        }).queue(urls);
});

