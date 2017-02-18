App.ApplicationController = Ember.ObjectController.extend({
  actions: {
    startClock: function() {
      if(currentSelected != -1){
        clockState.activate();
        pomodoroClock.start();
      }else{
        alert("first select a task in the list :D");
      }
    },
    stopClock: function() {
      pomodoroClock.stop();
    }
  }
});
