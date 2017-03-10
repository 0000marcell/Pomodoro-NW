let path = require('path'),
    fs = require('fs'),
    os = require('os'),
    __homedir = os.homedir(),
    awsUseStorage = false,
    devMode = true,
    pomodoroFilesPath;


const gui = require('nw.gui'),
      win = gui.Window.get();
// Dont forget to put devMod to false if you plan to compile 
// for production
if(devMode){
  pomodoroFilesPath = './pomodoro-files';
}else{
  pomodoroFilesPath = `${__homedir}/pomodoro-files`;
}
let generalConfigPath = `${pomodoroFilesPath}/config.json`,
    mainDataPath = `${pomodoroFilesPath}/data.json`;
if(!fs.existsSync(pomodoroFilesPath)){
  try{
    fs.mkdirSync(pomodoroFilesPath);
  }catch(err){
    console.log(`error trying to create folder: ${err}`)
  }
  let defaultConfig = {accessKeyId: null, 
      secretAccessKey: null, region: null, 
      mainDataPath: mainDataPath};
  fs.writeFileSync(generalConfigPath, 
      JSON.stringify(defaultConfig));
  fs.createReadStream('data.json').pipe(fs.createWriteStream(mainDataPath));
}

let config;
try{
  config = JSON.parse(fs.readFileSync(generalConfigPath));
}catch(err){
  console.log(`error trying to read config file ${err}`);
}

if (config.accessKeyId) {
  awsUseStorage = true;
}else{
  awsUseStorage = false;
}

if(awsUseStorage){
  AWS.config.update({accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, region: config.region});
  let bucket = new AWS.S3({params: {Bucket: 'pomodorog'}});
}

App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

let intervalCount = 0,
    pomodoroTime = 25 * 60, restart = false,
    shortIntervalTime = 5 * 60, longIntervalTime = 10 * 60,
    pause = false;

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  namespace: 'Pomodoro-Grunt-Node'
});  
