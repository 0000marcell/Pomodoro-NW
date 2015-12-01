App.ApplicationRoute = Ember.Route.extend({
  taskVisibility: true, 
  model: function() {
    return this.store.find('task');
  },
  actions: {
    didTransition: function() {
      this.taskVisibility = true; 
    },
    new: function() {
      this.transitionTo('tasks.new');
    },
    edit: function(task) {
      this.transitionTo('tasks.edit', task);
    },
    show: function(task){
      task.setTotalTime();
      task.formatDates();
      this.transitionTo('tasks.show', task);
    },
    // Save and transition to /tasks/:task_id only if validation passes.
    save: function(task) {
      var _this = this;
      task.validate().then(function() {
        task.save();
        task.set('creation_date', 
                  new Date().getDateString());
        task.saveOnFile();
        _this.transitionTo('index');
      });
    },

    statistics: function(){
      $('#clock-container').hide('slow/400/fast');
      this.transitionTo('tasks.statistics');
    }, 

    showHideTasks: function(){
      $('#tasks').toggle('slow/400/fast');
      var height = (this.taskVisibility) ? 325 : 625;
      this.taskVisibility = (height == 625) ? true : false;
      appWindow.resize(630, height);
    },
    
    resizeWindow: function(width, height){
      win.width = width, win.height = height;  
    },
    main: function(){
     $('#clock-container').show('slow/400/fast');
      appWindow.resize(615, 600);
     this.transitionTo('tasks');  
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
    },
    // Roll back and transition to /tasks/:task_id.
    cancel: function(task) {
      task.rollback();
      this.transitionTo('index');
    },
    // Delete specified task.
    delete: function(task) {
      var _this = this;
      task.destroyRecord().then(function(){
       task.saveOnFile();
       _this.transitionTo('index');
      });
    },
    selectTask: function(id, event){
      Ember.set(event, "checked", true);
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
    }
  }
});
