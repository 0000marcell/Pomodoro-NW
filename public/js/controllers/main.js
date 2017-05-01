App.MainController = Ember.ObjectController.extend({
  selectedItem: null,
  taskVisibility: true, 
  actions: {
    selectTask(task){
      $(`#${this.get('selectedItem')}`)
        .removeClass('selected-task');     
      $(`#${task.id}`).addClass('selected-task');
      this.set('selectedItem', task.id);
      let appController = App.__container__.lookup("controller:application"); 
      clock.reset(pomodoroTime);
      appController.set('selectedTaskMsg', task.name);
      appController.set('selectedTask', task);
      clock.reset(pomodoroTime);
      clock.pause();
    },
    showHideTasks: function(){
      $('#main-view').toggle('slow/400/fast');
      $('#application-view').toggle('slow/400/fast');
      var height = (this.taskVisibility) ? 325 : 775;
      this.taskVisibility = (height == 775) ? true : false;
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
