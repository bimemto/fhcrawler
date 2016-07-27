var Crawler = require("crawler");
var url = require('url');
var db = require('./db.js');

db.getPokemonList(function(rows){
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var detailsUrl = 'http://pokemongo.gamepress.gg/pokemon/' + id;
        new Crawler({
            maxConnections: 10,
            callback: function(error, result, $) {
                if($){
                    $('tbody.list').find('tr').find('td').each(function(index, td){
                    	var stardust, level, minCP, maxCP;
                        switch(index){
                            case 0:
                                stardust = $(td).text();
                                break;
                            case 1:
                                level = $(td).text();
                                break;
                            case 2:
                                minCP = $(td).text();
                                break;
                            case 3:
                                maxCP = $(td).text();
                                break;
                        }
                        console.log(id + ', ' + stardust + ', ' + minCP + ', ' + maxCP);
                        //db.insertPokeCP(id, stardust, level, minCP, maxCP);
                    })
                }
            }
        }).queue(detailsUrl);
    }
});