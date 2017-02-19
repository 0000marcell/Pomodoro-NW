App.ApplicationRoute = Ember.Route.extend({
  // render the template!
  afterModel(){
    this.transitionTo('main');
  },
  model: function() {
    return this.store.findAll('task');
  },
  actions: {
    new: function() {
      this.transitionTo('new');
    },
    edit: function(task) {
      this.transitionTo('edit', task);
    },
    show: function(task){
      task.setTotalTime();
      task.formatDates();
      this.transitionTo('tasks.show', task);
    },
    statistics: function(){
      this.transitionTo('statistics');
    }, 
    resizeWindow: function(width, height){
      win.width = width, win.height = height;  
    },
    main: function(){
     appWindow.resize(615, 600);
     this.transitionTo('main');  
    },
    config: function(){
      this.transitionTo('config');
    },
    savePomodoro: function(){
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
