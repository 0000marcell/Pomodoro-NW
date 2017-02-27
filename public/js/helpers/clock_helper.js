function longInterval(){
  win.focus();
  var controller = App.__container__.lookup("controller:main");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(longIntervalTime);
  pomodoroClock.start();
}

function shortInterval(){
  win.focus();
  var controller = App.__container__.lookup("controller:main");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(shortIntervalTime);
  pomodoroClock.start();
}
