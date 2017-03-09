App.MainController = Ember.ObjectController.extend({
  selectedTaskMsg: 'No task selected!',
  taskVisibility: true, 
  stopClock(){
    if(pause == true){
      clock.pause();
      return;
    }
    if(restart == true){
      clock.reset(pomodoroTime);
      clock.start();
      clock.reactivate();
      restart = false;
      return;
    }
    intervalCount++;
    $('#streak').html(intervalCount);
    clock.interval();
    ((intervalCount % 3) == 0) ? this.longInterval() : 
    this.shortInterval();
  },
  longInterval(){
    win.focus();
    this.savePomodoro();
    restart = true;
    clock.reset(longIntervalTime);
    clock.start();
  },
  shortInterval(){
    win.focus();
    this.savePomodoro();
    restart = true;
    clock.reset(shortIntervalTime);
    clock.start();
  },
  actions: {
    startClock() {
      if(this.get('selectedTask') && 
        clock.get('currentState') !== 'active'){
        clock.activate();
        clock.start();
      }else{
        this.set('selectedTaskMsg', 'First select a task!')
      }
    },
    stopClock() {
      clock.stop();
    },
    selectTask: function(id){
      clock.stop();
      intervalCount = 0;
      pause = false;
      restart = false;
      $('#streak').html(intervalCount);
      currentSelected = id;
      this.store.find('task', id).then((task) => {
       task.set('last_active', utils.getDateString( new Date());
       pomodoroTime = parseInt(task.get('duration')) * 60;
       clock.reset(pomodoroTime);
       this.set('selectedTask', task);
       this.set('selectedTaskMsg', task.get('name'));
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
      appWindow.resize(500, height);
    },
    savePomodoro(){
      task.get('pomodoros')
        .pushObject({ "date": utils.getDateString(new Date())});
      task.save().then(() => {
        task.saveOnFile();
      });
    },
    edit(task) {
      this.transitionTo('edit', task);
    }
  }
});
