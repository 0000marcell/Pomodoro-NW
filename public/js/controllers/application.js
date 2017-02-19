App.ApplicationController = Ember.ObjectController.extend({
  actions: {
    startClock() {
      if(currentSelected != -1){
        clockState.activate();
        pomodoroClock.start();
      }else{
        alert("first select a task in the list :D");
      }
    },
    stopClock() {
      pomodoroClock.stop();
    }
  }
});
