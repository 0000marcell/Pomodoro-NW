App.MainController = Ember.ObjectController.extend({
  selectedTaskMsg: 'No task selected!',
  taskVisibility: true, 
  stopClock(){
    if(pause == true){
      clockState.pause();
      return;
    }
    if(restart == true){
      pomodoroClock.reset(pomodoroTime);
      pomodoroClock.start();
      clockState.reactivate();
      restart = false;
      return;
    }
    intervalCount++;
    $('#streak').html(intervalCount);
    clockState.interval();
    ((intervalCount % 3) == 0) ? longInterval() : 
    shortInterval();
  },
  longInterval(){
    win.focus();
    this.savePomodoro();
    restart = true;
    pomodoroClock.reset(longIntervalTime);
    pomodoroClock.start();
  },
  shortInterval(){
    win.focus();
    this.savePomodoro();
    restart = true;
    pomodoroClock.reset(shortIntervalTime);
    pomodoroClock.start();
  },
  actions: {
    startClock() {
      if(this.get('selectedTask') && 
        clockState.currentState !== 'active'){
        clockState.activate();
        pomodoroClock.start();
      }else{
        this.set('selectedTaskMsg', 'First select a task!')
      }
    },
    stopClock() {
      pomodoroClock.stop();
    },
    selectTask: function(id){
      pomodoroClock.stop();
      intervalCount = 0;
      pause = false;
      restart = false;
      $('#streak').html(intervalCount);
      currentSelected = id;
      this.store.find('task', id).then((task) => {
       task.set('last_active', new Date().getDateString());
       pomodoroTime = parseInt(task.get('duration')) * 60;
       pomodoroClock.reset(pomodoroTime);
       this.set('selectedTask', task);
       this.set('selectedTaskMsg', task.get('name'));
       clockState.pause();
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
        .pushObject({ "date": new Date().getDateString()});
      task.save().then(() => {
        task.saveOnFile();
      });
    }
  }
});
