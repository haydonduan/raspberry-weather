var jsdom = require("node-jsdom");
var AipSpeechClient = require("./aip-node-sdk-1.2.1").speech;
var fs=require('fs');
var APP_ID = "10374492";
var API_KEY = "NSw1KN1fQZI46ByFl2QcakIE";
var SECRET_KEY = "5c36305c729df55b8bea4c570fae81fa";
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);
var exec = require('child_process').exec;
var mp3File = 'weather.mp3'

function generateMp3(text) {
  client.text2audio(text, {spd: 5, per: 1}).then(function(result) {
    fs.writeFileSync(mp3File, result.data);
  }).then(function() {
    exec('play '+ mp3File, function(err,stdout,stderr){
      if(err) {
        console.log(err);
      }
    });
  });
}

jsdom.env({
  url: "http://www.weather.com.cn/weather1d/101010100.shtml#dingzhi_first",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (errors, window) {
    var $ = window.$;
    var text = $($(".wea")[0]).text();
    generateMp3('今天北京天气：' + text);
  }
});
