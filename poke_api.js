var db = require('./db.js');
var express = require('express');
var app = express();

app.get('/pokemon/api/list', function(req, res) {
	db.getPokemonList(function(rows) {
		var data = [];
		for (var i = 0; i < rows.length; i++) {
			var id = rows[i].id;
			var name = rows[i].name;
			var maxCP = rows[i].maxCP;
			var image = 'http://pokemongo.gamepress.gg//sites/default/files/2016-07/' + id + '.png';
			data[i] = {id: id, name: name, maxCP: maxCP, image: image};
		}
		res.send(data);
	});
})

app.get('/pokemon/api/stats', function(req, res) {
	var pokeId = req.param('id');
	db.getPokeStats(pokeId, function(rows) {
		var id = rows.id;
		var baseAtk = rows.baseAtk;
		var baseDef = rows.baseDef;
		var baseSta = rows.baseSta;
		var captureRate = rows.captureRate;
		var fleeRate = rows.fleeRate;
		var type = rows.type;
		var candy = rows.candy;
		var hatchDistance = rows.hatchDistance;
		var data = {id: id, baseAtk: baseAtk, baseDef: baseDef, baseSta: baseSta, captureRate: captureRate, fleeRate: fleeRate, type: type, candy: candy, hatchDistance: hatchDistance};
		res.send(data);
	});
})

app.get('/pokemon/api/cp', function(req, res) {
	var pokeId = req.param('id');
	db.getPokeCPs(pokeId, function(rows) {
		var data = [];
		for (var i = 0; i < rows.length; i++) {
			var id = rows[i].id;
			var stardust = rows[i].stardust;
			var level = rows[i].level;
			var minCP = rows[i].minCP;
			var maxCP = rows[i].maxCP;
			var data[i] = {id: id, stardust: stardust, level: level, minCP: minCP, maxCP: maxCP};
		}
		res.send(data);
	});
})

var server = app.listen(6789, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})
