// AWS Set-up 
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'AKIAIGLNE5EBTG5RFINQ', secretAccessKey: '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', region: 'sa-east-1'});
var bucket = new AWS.S3({params: {Bucket: 'pomodorog'}});

var appClock, intervalCount = 0,
    pomodoroTime = 25 * 60, restart = false,
    shortIntervalTime = 1 * 5, longIntervalTime = 1 * 10,
    pause = false, pomodoroClock,
    jsonio = new JSONIO(), statistics = new PomodoroStatistics(), 
    appWindow = new WindowFunctions(), currentSelected = -1, clockState = new ClockState(),
    newTask;

App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  namespace: 'Pomodoro-Grunt-Node'
});  

  
