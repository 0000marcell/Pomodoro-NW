App.MainView = Ember.View.extend({
  templateName: 'main',
  didInsertElement: function(){
    let controller = App.__container__.lookup("controller:main");
    let flipClock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: controller.stopClock
      }
    }); 
    clock.set('flipClock', flipClock);
    clock.initialize();
  }
});
