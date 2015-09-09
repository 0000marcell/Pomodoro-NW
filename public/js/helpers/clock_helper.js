function longInterval(){
  win.focus();
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(longIntervalTime);
  pomodoroClock.start();
}

function shortInterval(){
  win.focus();
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(shortIntervalTime);
  pomodoroClock.start();
}
