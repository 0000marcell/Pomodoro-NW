
function PomodoroClock(){
}


PomodoroClock.prototype.initialize = function(){
  this.showClock(); 
  clock.setCountdown(true);
  clock.setTime(pomodoroTime);
}

PomodoroClock.prototype.stop = function(){
  pause = true;
  clock.stop();
}

PomodoroClock.prototype.start = function(){
  pause = false;
  clock.start();
}

PomodoroClock.prototype.reset = function(sec){
  clock.setTime(sec); 
}


