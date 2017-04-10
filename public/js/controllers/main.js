App.MainController = Ember.ObjectController.extend({
  taskVisibility: true, 
  actions: {
    selectTask: function(id){
      let appController = App.__container__.lookup("controller:application"); 
      clock.reset(pomodoroTime);
      this.store.find('task', id).then((task) => {
        appController.set('selectedTaskMsg', task.get('name'));
        appController.set('selectedTask', task);
        clock.reset(pomodoroTime);
        clock.pause();
      });
    },
    showHideTasks: function(){
      $('.scrollable').toggle('slow/400/fast');
      $('.options-row').toggle('slow/400/fast');
      $('.add-row').toggle('slow/400/fast');
      var height = (this.taskVisibility) ? 245 : 725;
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
