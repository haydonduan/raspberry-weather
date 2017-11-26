var jsdom = require("node-jsdom");
var AipSpeechClient = require("./aip-node-sdk-1.2.1").speech;
var fs=require('fs');
var _=require('lodash');
var exec = require('child_process').exec;
var mp3File = 'weather.mp3'

// key..
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

function generateMp3(text) {
  //  0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫
  client.text2audio(text, {spd: 4, per: 2}).then(function(result) {
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
    var text = $($(".wea")[0]).text() + '。。。。。以下是生活指数:';
    _.forEach($('.livezs .hot'), function(item, index) {
      var details = _.filter($(item).text().split('\n'), function(x){return !_.isEmpty(x)})
      var title = details[1];
      var subTitle = details[0];
      var description = details[2];
      text = text + (index + 1) + ':' + title + ':' + subTitle + ',' + description;
    });

    var time = new Date();
    var timeTips = '现在时间:' + time.getHours() + '点，'+ time.getMinutes() + '分；';
    generateMp3('亲爱的西西公主，'+ timeTips + text);
  }
});
