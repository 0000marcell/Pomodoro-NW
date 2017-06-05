import Ember from 'ember';

export default Ember.Controller.extend({
  clock: {
    state: 'paused',
    mode: 'pomodoro',
    time: 5,
    shortInterval: 10,
    longInterval: 10,
    streak: 0
  },
  actions: {
    startClock(clock){
      console.log('start clock!');
      clock
        .setTime(this.get('clock.shortInterval'));
      clock.start();
    },
    stopClock(clock){
      console.log('stop clock!');
      clock
        .setTime(this.get('clock.shortInterval'));
      clock.start();
    }  
  }
});
