var path = require('path');
var os = require('os');
var __homedir = os.homedir();
var awsUseStorage = false;
var pomodoroFilesPath = `${__homedir}/pomodoro-files`;
var generalConfigPath = `${pomodoroFilesPath}/config.json`;
var mainDataPath = `${pomodoroFilesPath}/data.json`;

if(!fs.existsSync(pomodoroFilesPath)){
  try{
    fs.mkdirSync(pomodoroFilesPath);
  }catch(err){
    alert(`error trying to create folder: ${err}`)
  }
  var defaultConfig = {accessKeyId: null, 
      secretAccessKey: null, region: null, 
      mainDataPath: mainDataPath};
  fs.writeFileSync(generalConfigPath, 
      JSON.stringify(defaultConfig));
  fs.createReadStream('data.json').pipe(fs.createWriteStream(mainDataPath));
}
try{
  var config = JSON.parse(fs.readFileSync(generalConfigPath));
}catch(err){
  alert(`error trying to read config file ${err}`);
}

if (config.accessKeyId) {
  awsUseStorage = true;
}else{
  awsUseStorage = false;
}

if(awsUseStorage){
  AWS.config.update({accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, region: config.region});
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
