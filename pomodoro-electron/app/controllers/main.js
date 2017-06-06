import Ember from 'ember';

export default Ember.Controller.extend({
  clock: {
    state: 'paused',
    mode: 'pomodoro',
    time: 5,
    shortInterval: 10,
    longInterval: 15,
    streak: 0,
    pausedByUser: false
  },
  actions: {
    stopClock(clock){
      console.log(clock.get('clock.pausedByUser'));
      if(clock.get('clock.pausedByUser')){
        return;
      }
      clock.incrementProperty('clock.streak');
      let model = this.get("model");
      if(clock.get('clock.mode') === 'pomodoro'){
        // TODO save the task
        if(this.get('clock.streak')%3 === 0){
          clock
            .setTime(this.get('clock.longInterval'));
        }else{
          clock
            .setTime(this.get('clock.shortInterval'));
        }
        clock.set('clock.mode', 'iterval');
      }else{
        clock
            .setTime(this.get('clock.time'));
        clock.set('clock.mode', 'pomodoro');
      }
      clock.start();
    }  
  }
});
