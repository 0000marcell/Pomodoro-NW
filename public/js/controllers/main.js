App.MainController = Ember.ArrayController.extend({
  taskVisibility: true, 
  actions: {
    selectTask: function(id){
      pomodoroClock.stop();
      intervalCount = 0;
      pause = false;
      restart = false;
      $('#streak').html(intervalCount);
      currentSelected = id;
      var currentSelectedDuration;
      var _this = this;
      this.store.find('task', id).then(function(task){
       currentSelectedDuration = task.get('duration');
       task.set('last_active', new Date().getDateString());
       pomodoroTime = parseInt(currentSelectedDuration) * 60;
       pomodoroClock.reset(pomodoroTime);
       $('#task-name').html("<h4>"+task.get('name')+"</h4>");
       clockState.pause();
      });
    },
    showHideTasks: function(){
      $('.scrollable').toggle('slow/400/fast');
      $('.options-row').toggle('slow/400/fast');
      $('.add-row').toggle('slow/400/fast');
      var height = (this.taskVisibility) ? 235 : 650;
      this.taskVisibility = (height == 650) ? true : false;
      if(this.taskVisibility){
        $('.show-hide i')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up')
      }else{
        $('.show-hide i')
          .removeClass('fa-arrow-up')
          .addClass('fa-arrow-down')
      }
      appWindow.resize(465, height);
    }
  }
});
