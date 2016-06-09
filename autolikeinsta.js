var Instanode = require('instanode');
var fs = require("fs");
var api = require('instagram-node').instagram();

var instaClient;
var accessToken = '32371706.36dd655.09061a0968d641cf8cc00487ab7d2d69';
var options = { count: 30};

fs.exists('insta.json', function(exists){
  if(exists){
   var instaUser = JSON.parse(fs.readFileSync('insta.json', 'utf8'));
   if(instaUser){
    instaClient = new Instanode(instaUser);
    getFeed();
  } else {
    instaClient = new Instanode('duysalem', 'NEDite4F8K4i82Xk');
    instaClient.login((err, result) => {
      fs.writeFileSync('insta.json', JSON.stringify(result));
      getFeed();
    });
  }
} else {
  instaClient = new Instanode('duysalem', 'NEDite4F8K4i82Xk');
  instaClient.login((err, result) => {
    fs.writeFileSync('insta.json', JSON.stringify(result));
    getFeed();
  });
}
});

function getFeed(){
 var instaUser = JSON.parse(fs.readFileSync('insta.json', 'utf8'));
 instaClient.autoCompleteUserList(instaUser, function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log(res);  
    api.use({ access_token: accessToken });
    
    api.user_media_recent('32371706', options, function(err, result, pagination, remaining, limit) {
        if(err){
        console.log(err);
      } else {
        console.log(result);
      }
    });
    // api.likes('1268156391544483079_3146832458', function(err, result, remaining, limit) {
    //   if(err){
    //     console.log(err);
    //   } else {
    //     console.log(result);
    //   }
    // });
  }  
});
}

// var http = require('http');
// var express = require('express');

// var app = express();
// var request = require('request');

// // app.configure(function() {
// //   // The usual...
// // });

// var myId = '32371706';
// api.use({ access_token: accessToken });

// var options = { count: 30};

// api.user_follows(myId, options, function(err, users, pagination, remaining, limit) {
//   console.log(users);
// });


// // request.get('https://api.instagram.com/v1/users/self/feed?access_token=' + accessToken, function(req, res){
// // 	console.log(res);
// // });

// // api.use({
// //   client_id: '36dd65558ed94677b70a9ad071b01de0',
// //   client_secret: '0e285377af0843be8d2af6cba0286eb3'
// // });

// // var redirect_uri = 'http://bu.1ly.co:8080/handleauth';

// // exports.authorize_user = function(req, res) {
// //   res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes+basic'], state: 'test' }));
// // };

// // exports.handleauth = function(req, res) {
// //   api.authorize_user(req.query.code, redirect_uri, function(err, result) {
// //     if (err) {
// //       console.log(err.body);
// //       res.send("Didn't work");
// //     } else {
// //       console.log('Yay! Access token is ' + result.access_token);
// //       res.send('You made it!!');
// //     }
// //   });
// // };

// // // This is where you would initially send users to authorize
// // app.get('/authorize_user', exports.authorize_user);
// // // This is your redirect URI
// // app.get('/handleauth', exports.handleauth);

// // var server = app.listen(8080, function() {

// //     var host = server.address().address
// //     var port = server.address().port

// //     console.log("Example app listening at http://%s:%s", host, port)

// // })