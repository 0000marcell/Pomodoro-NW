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
      clock.modeInterval();
      clock.start();
    } 
  },
  savePomodoro(task){
    task.get('pomodoros')
      .pushObject({ "date": new Date()});
    fileIO
      .saveTasks(utils.transformTaskObject(this.store.all('task').content));
  },
  actions: {
    startClock() {
      if(this.get('selectedTask') && clock.get('state') === 'active'){
        alert('you need to pause the clock if you want to select another task!');
      }else{
        if(this.get('selectedTask') && 
          clock.get('state') === 'paused'){
          clock.modeActive();
          clock.start();
        }else{
          this.set('selectedTaskMsg', 'First select a task!')
        }
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
