// AWS Set-up 
var path = require('path');
var __dirname = path.dirname(document.currentScript.src.slice(7));
var awsConfigPath = `${__dirname}/helpers/aws_config.json`;
var awsUseStorage = false;

if (fs.existsSync(awsConfigPath)) {
  awsUseStorage = true;
}else{
  awsUseStorage = false;
}
if(awsUseStorage){
  aws_info = read_aws_info(awsConfigPath);
  AWS.config.update({accessKeyId: aws_info.accessKeyId, secretAccessKey: aws_info.secretAccessKey, region: aws_info.region});
  var bucket = new AWS.S3({params: {Bucket: 'pomodorog'}});
}

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
