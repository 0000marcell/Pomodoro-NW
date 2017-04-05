App.ApplicationController = Ember.ObjectController.extend({
  actions: {
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
