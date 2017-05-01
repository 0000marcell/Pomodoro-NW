App.ApplicationController = Ember.ObjectController.extend({
  options: [{link: 'schedule', icon: 'fa fa-clock-o fa-2x'},
            {link: 'statistics', icon: 'fa fa-bar-chart fa-2x'},
            {link: 'config', icon: 'fa fa-cog fa-2x'}],
  showClock: true,
  intervalCount: 0,
  selectedTaskMsg: 'No task selected!',
  /** saves the new pomodoro when
   * the clock reaches zero
  */
  stopClock(){
    /* 
     * verifies if the clock was stoped because it reached zero
     * or because the user stoped it
    */
    if(clock.get('state') === 'paused'){
      return;
    }else if (clock.get('state') === 'interval'){
      clock.reset(pomodoroTime);
      clock.modeActive();
      clock.start();
    } else {
      this.set('intervalCount', 
        this.get('intervalCount') + 1);
      this.savePomodoro(this.get('selectedTask'));
      win.focus();
      let interval = ((this.get('intervalCount') % 3) == 0) ? longIntervalTime : 
                                                              shortIntervalTime;
      clock.reset(interval);
      clock.start();
      clock.modeInterval();
    } 
  },
  savePomodoro(task){
    task.pomodoros
      .pushObject({ "date": new Date()});
    store.save();
  },
  actions: {
    close(){
      win.close();
    },
    minimize(){
      win.minimize(); 
    },
    startClock() {
      if(this.get('selectedTask') && clock.get('state') === 'paused'){
        clock.start();
      }else{
        this.set('selectedTaskMsg', 'First select a task!');
      }
    },
    stopClock() {
      clock.pause();
    },
    transitionTo(route){
      this.transitionToRoute(route);
    },
    resizeWindow(width, height){
      win.width = width, win.height = height;  
    }
  }
});
