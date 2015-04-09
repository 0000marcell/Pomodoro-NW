function longInterval(){
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  intervalCount = 0;
  pomodoroClock.reset(longIntervalTime);
  pomodoroClock.start();
}

function shortInterval(){
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(shortIntervalTime);
  pomodoroClock.start();
}
