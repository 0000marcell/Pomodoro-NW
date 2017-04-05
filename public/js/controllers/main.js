App.MainController = Ember.ObjectController.extend({
  intervalCount: 0,
  selectedTaskMsg: 'No task selected!',
  taskVisibility: true, 
  /** saves the new pomodoro when
   * the clock reaches zero
  */
  stopClock(){
    /* 
     * verifies if the clock was stoped because it reached zero
     * or because the user stoped it
    */
    if(clock.get('state') !== 'active'){
      return;
    }  
    this.set('intervalCount', 
      this.get('intervalCount') + 1);
    this.savePomodoro(this.get('selectedTask'));
    win.focus();
    let interval = ((this.get('intervalCount') % 3) == 0) ? 10 * 60 : 
                                                            5 * 60;
    clock.reset(longIntervalTime);
    clock.activate();
  },
  savePomodoro(task){
    task.get('pomodoros')
      .pushObject({ "date": new Date()});
    fileIO.saveTasks(this.store.all('task'));
  },
  actions: {
    startClock() {
      if(this.get('selectedTask') && clock.get('state') === 'active'){
        alert('you need to pause the clock if you want to select another task!');
      }else{
        if(this.get('selectedTask') && 
          clock.get('state') === 'paused'){
          clock.activate();
        }else{
          this.set('selectedTaskMsg', 'First select a task!')
        }
      }
    },
    stopClock() {
      clock.pause();
    },
    selectTask: function(id){
      clock.reset(pomodoroTime);
      this.store.find('task', id).then((task) => {
        this.set('selectedTaskMsg', task.get('name'));
        this.set('selectedTask', task);
        clock.reset(pomodoroTime);
        clock.pause();
      });
    },
    showHideTasks: function(){
      $('.scrollable').toggle('slow/400/fast');
      $('.options-row').toggle('slow/400/fast');
      $('.add-row').toggle('slow/400/fast');
      var height = (this.taskVisibility) ? 245 : 695;
      this.taskVisibility = (height == 695) ? true : false;
      if(this.taskVisibility){
        $('.show-hide i')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up')
      }else{
        $('.show-hide i')
          .removeClass('fa-arrow-up')
          .addClass('fa-arrow-down')
      }
      win.width = 500;
      win.height = height;
    },
    edit(task) {
      this.transitionToRoute('edit', task);
    },
    new(){
      this.transitionToRoute('new');
    }
  }
});
