var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();
var request = require('request');

// app.configure(function() {
//   // The usual...
// });
// var accessToken = '32371706.36dd655.26b39f4bdf2a427d83a6d5674dc3a213';

// request.get('https://api.instagram.com/v1/users/self/feed?access_token=' + accessToken, function(req, res){
// 	console.log(res);
// });

api.use({
  client_id: '36dd65558ed94677b70a9ad071b01de0',
  client_secret: '0e285377af0843be8d2af6cba0286eb3'
});

var redirect_uri = 'http://bu.1ly.co:8080/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes+basic+comments',], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

var server = app.listen(8080, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})