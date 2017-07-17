App.ApplicationController = Ember.ObjectController.extend({
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
    }
    setTimeout(() => {
      if (clock.get('state') === 'interval'){
        clock.reset(pomodoroTime);
        setTimeout(() => {
          clock.start();
        }, 1000);
      } else {
        clock.set('intervalCount', 
          clock.get('intervalCount') + 1);
        this.set('intervalCount', 
          clock.get('intervalCount'));
        this.set
        this.savePomodoro(this.get('selectedTask'));
        win.focus();
        let interval = 
          ((clock.get('intervalCount') % 3) == 0) ? 
            longIntervalTime : 
            shortIntervalTime;
        clock.reset(interval);
        setTimeout(() => {
          clock.start();
        }, 1000);
      }
    }, 1000);
  },
  savePomodoro(task){
    task.get('pomodoros')
      .pushObject({ "date": new Date()});
    fileIO
      .saveTasks(utils.transformTaskObject(this.store.all('task').content));
  },
  actions: {
    close(){
      win.close();
    },
    minimize(){
      win.minimize(); 
    },
    startClock() {
      if(this.get('selectedTask') && 
        clock.get('state') === 'paused'){
        clock.start();
      }else if(!this.get('selectedTaskMsg')){
        this.set('selectedTaskMsg', 'First select a task!');
      }
    },
    stopClock() {
      clock.pause();
    },
    new() {
      this.transitionToRoute('new');
    },
    show(task){
      task.setTotalTime();
      task.formatDates();
      this.transitionToRoute('tasks.show', task);
    },
    statistics(){
      this.transitionToRoute('statistics');
    }, 
    resizeWindow(width, height){
      win.width = width, win.height = height;  
    },
    main(){
     this.transitionToRoute('main');  
    },
    config(){
      this.transitionToRoute('config');
    }
  }
});
