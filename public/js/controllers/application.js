App.ApplicationController = Ember.ObjectController.extend({
  actions: {
    new() {
      this.transitionTo('new');
    },
    edit(task) {
      this.transitionTo('edit', task);
    },
    show(task){
      task.setTotalTime();
      task.formatDates();
      this.transitionTo('tasks.show', task);
    },
    statistics(){
      this.transitionTo('statistics');
    }, 
    resizeWindow(width, height){
      win.width = width, win.height = height;  
    },
    main(){
     this.transitionTo('main');  
    },
    config(){
      this.transitionTo('config');
    },
    savePomodoro(){
      var _this = this;
      this.store.find('task', currentSelected).then(function(task){
        var pomodoro = { "date": new Date().getDateString()};
        task.get('pomodoros').pushObject(pomodoro);
        task.save().then(function(){
          task.saveOnFile();
        });
      });
    }
  }
});
