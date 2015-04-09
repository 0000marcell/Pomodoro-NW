
function PomodoroClock(){
}

PomodoroClock.prototype.showClock = function(){
  clock = $('.clock').FlipClock({
    clockFace: 'MinuteCounter',
    autoStart: false,
    callbacks: {
      stop: function() {
         if(pause == true){
          return;
        }
        if(restart == true){
          pomodoroClock.reset(pomodoroTime);
        }
        intervalCount++;
        $('.message').html('intervalo! '+intervalCount);
        (intervalCount > 2) ? longInterval() : 
        shortInterval();
      }
    }
  });
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


