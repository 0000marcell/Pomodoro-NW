App.MainView = Ember.View.extend({
  templateName: 'main',
  didInsertElement: function(){
    let controller = App.__container__.lookup("controller:main");
    clock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: controller.stopClock
      }
    }); 
    pomodoroClock = new PomodoroClock();
    clock.setCountdown(true);
    clock.setTime(pomodoroTime);
  }
});
