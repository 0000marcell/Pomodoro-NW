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
    stopClock(clock){
      console.log('stop clock!');
      this.increaseProperty('clock.streak');
      if(this.get('clock.streak')){
        clock
          .setTime(this.get('clock.shortInterval'));
        this.set('clock.mode', 'iterval');
      }else{
        clock
          .setTime(this.get('clock.longInterval'));
      }
      clock.start();
    }  
  }
});
