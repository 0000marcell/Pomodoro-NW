App.MainView = Ember.View.extend({
  templateName: 'main',
  didInsertElement: function(){
    clock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: function() {
          if(pause == true){
            clockState.pause();
            return;
          }
          if(restart == true){
            pomodoroClock.reset(pomodoroTime);
            pomodoroClock.start();
            clockState.reactivate();
            restart = false;
            return;
          }
          intervalCount++;
          $('#streak').html(intervalCount);
          clockState.interval();
          ((intervalCount % 3) == 0) ? longInterval() : 
          shortInterval();
        }
      }
      }); 
    pomodoroClock = new PomodoroClock();
    clock.setCountdown(true);
    clock.setTime(pomodoroTime);
  }
});
