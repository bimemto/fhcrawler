var login = require("facebook-chat-api");
var fs = require("fs");
var db = require("./db.js")
var dateFormat = require("dateformat");
var request = require('request'); 
var Crawler = require("crawler");
var http = require('http');

var imgs = [];

fs.exists('botpage.json', function(exists) {
  if (exists) {
    var appstate = JSON.parse(fs.readFileSync('botpage.json', 'utf8'));
    if(appstate){
       login({appState: appstate}, function callback (err, api) {
          if(err){
            switch (err.error) {
              case 'login-approval':
              console.log('Enter code > ');
              rl.on('line', function(line){
                err.continue(line);
                rl.close();
            });
              break;
          }
      }
      doAction(api);
  })} else {
          login({
            email: "+841656123802",
            password: "CG7U8rdbB7maAE"
        }, function callback(err, api) {
            if(err){
              switch (err.error) {
                case 'login-approval':
                console.log('Enter code > ');
                rl.on('line', function(line){
                  err.continue(line);
                  rl.close();
              });
                break;
            }
        }
        doAction(api);
    });
      }
  } else {
    login({
      email: "+841656123802",
      password: "CG7U8rdbB7maAE"
  }, function callback(err, api) {
      if(err){
        switch (err.error) {
          case 'login-approval':
          console.log('Enter code > ');
          rl.on('line', function(line){
            err.continue(line);
            rl.close();
        });
          break;
      }
  }
  doAction(api);
});
}
});

function doAction(api){
    fs.writeFileSync('botpage.json', JSON.stringify(api.getAppState()));
    db.connectDB(function(err, res) {

    });
    api.setOptions({
        listenEvents: true,
    });
    var stopListening = api.listen(function(err, event) {
        if (err) {
            console.error(err);
        }
        if (event) {
            var dayBefore = 0;
            switch (event.type) {
                case "message":
                if (event.body) {
                    if (event.body === '/stop') {
                        api.sendMessage("Goodbye...", event.threadID);
                        return stopListening();
                    } else if(event.body.indexOf('/img') > -1){
                      var uri = 'http://' + imgs[getRandomInt(0, imgs.length)];
                      var file = fs.createWriteStream("img.jpg");
                      var request = http.get(uri, function(error, response) {
                        if(error){
                          console.log(error);
                      } else {
                          response.pipe(file);
                          file.on('finish', function(){
                            var msg = {
                              body: "Gái",
                              attachment: fs.createReadStream('img.jpg')
                          }
                          api.sendMessage(msg, event.threadID);
                      });
                      }

                  });
                  }
              }

              break;
              case "event":
              console.log(event);
              break;
          }
      }

  });
}

function getDateTime(dayBefore) {

    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate() - dayBefore;
    day = (day < 10 ? "0" : "") + day;

    return day + "-" + month + "-" + year;

}

var c3 = new Crawler({
    maxConnections: 10,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    callback: function(error, result, $) {
      if($){
        $('div.posts.sub-gallery.br5.first-child').find('div.post').each(function(index, div){
          var id = $(div).attr('id');
          var details_url = 'http://imgur.com/r/nsfw/' + id;
          new Crawler({
            maxConnections: 10,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
            callback: function(error, result, $) {
              if($){
                var img = $('div.post-image').find('img').attr('src');
                if(img === undefined || img === 'undefined' || img === ''){

                } else {
                  img = img.substring(2, img.length);
                  imgs.push(img);
              }
          }
      }
  }).queue(details_url);
      })
    }
}
});

c3.queue('http://imgur.com/r/nsfw');
