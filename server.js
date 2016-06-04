var YQL = require("yql");

var query = new YQL("select * from weather.forecast where (woeid = 2347727) and u='c'");

query.exec(function(err, data) {
  var location = data.query.results.channel.location;
  var wind = data.query.results.channel.wind;
  var condition = data.query.results.channel.item.condition;
  var forecast = data.query.results.channel.item.forecast;
  var fc;
  for (var i = 0; i < forecast.length; i++){
    fc = forecast[i].date + '\r\n' + forecast[i].high + '\r\n' + forecast[i].low + '\r\n' + forecast[i].text;
    //console.log(fc);
  }
  console.log('Wind: '+ degToCompass(wind.direction) + '\r\n' + wind.speed);
  console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
});

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["Bắc", "Bắc Bắc Đông", "Đông Bắc", "Đông Đông Bắc", "Đông", "Đông Đông Nam", "Đông Nam", "Nam Nam Đông", "Nam", "Nam Nam Tây", "Tây Nam", "Tây Tây Nam", "Tây", "Tây Tây Bắc", "Tây Bắc", "Bắc Bắc Tây"];
    return arr[(val % 16)];
}
