var db = require("./db.js");
var express = require('express');
var app = express();
var Crawler = require("crawler");

app.get('/bot/center',function(req, res){
	var command = req.param('command', null);
	console.log("command: = "+command);
	if(command === 'troi'){
		
	}
	res.send('OK');
});