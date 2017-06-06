import Ember from 'ember';

export default Ember.Controller.extend({
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
    },
    playPause(clock){
      if(!this.get('model.state.selectedTask')){
        console.log('first you need to select a task!');
        return;  
      }
      if(clock.get('active')){
        clock.set('clock.pausedByUser', true);
        clock.stop();
      }else{
        clock.start();
      }
      clock.toggleProperty('active');
    }
  }
});
