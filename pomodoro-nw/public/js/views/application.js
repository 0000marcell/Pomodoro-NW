App.ApplicationView = Ember.View.extend({
  templateName: 'application',
  didInsertElement: function(){
    let controller = App.__container__.lookup("controller:application");
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
