App.MainView = Ember.View.extend({
  templateName: 'main',
  didInsertElement: function(){
    win.width = 500;
    win.height = 695;
    let controller = App.__container__.lookup("controller:main");
    let flipClock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: controller.stopClock.bind(controller)
      }
    }); 
    clock.set('flipClock', flipClock);
    clock.initialize();
  }
});
