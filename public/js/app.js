// AWS Set-up 
aws_info = read_aws_info();
AWS.config.update({accessKeyId: aws_info.accessKeyId, secretAccessKey: aws_info.secretAccessKey, region: aws_info.region});
var bucket = new AWS.S3({params: {Bucket: 'pomodorog'}});
var appClock, intervalCount = 0,
    pomodoroTime = 25 * 60, restart = false,
    shortIntervalTime = 5 * 60, longIntervalTime = 10 * 60,
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

  
