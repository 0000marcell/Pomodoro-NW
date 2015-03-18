var appClock, intervalCount = 0,
    pomodoroTime = 25 * 60, restart = false,
    shortIntervalTime = 5 * 60, longIntervalTime = 10 * 60,
    pause = false, pomodoroClock,
    jsonio = new JSONIO(), statistics = new PomodoroStatistics(), 
    appWindow = new WindowFunctions(), currentSelected = -1,
    newTask;


App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  namespace: 'Pomodoro-Grunt-Node'
});

Ember.EasyForm.Config.registerWrapper('skeleton', {
  formClass: '',
  fieldErrorClass: 'has-error',
  inputClass: 'form-group',
  errorClass: 'help-block error',
  hintClass: 'help-block',
  labelClass: ''
});

App.Router.map(function() {
  this.resource('tasks', function() {
    this.route('new');
    this.route('show', {path: '/:task_id'});
    this.route('edit', {path: '/:task_id/edit'});
    this.route('statistics');
  });
  this.resource('config');
});

DS.ArrayTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return (Ember.typeOf(serialized) == "array")
        ? serialized 
        : [];
  },
  serialize: function(deserialized) {
    var type = Ember.typeOf(deserialized);
    if (type == 'array') {
        return deserialized
    } else if (type == 'string') {
        return deserialized.split(',').map(function(item) {
            return jQuery.trim(item);
        });
    } else {
        return [];
    }
  }
});

App.register("transform:array", DS.ArrayTransform);

App.Task = DS.Model.extend(Ember.Validations.Mixin, {
  name: DS.attr('string'),
  creation_date: DS.attr('string'),
  formated_creation_date: DS.attr('string'),
  last_active: DS.attr('string'),
  formated_last_active: DS.attr('string'),
  pomodoros: DS.attr('array'),
  duration: DS.attr('string'),
  totalTime: DS.attr('string'),
  
  // To identify html tag for a task.
  htmlID: function() {
    return 'task' + this.get('id');
  }.property('id'),

  validations: {
    name: {
      presence: true
    }
  },
  durations : ['55:00','1:00', '50:00','45:00'
               ,'40:00','35:00','30:00','25:00','20:00'],

  setTotalTime: function(){
    this.set('totalTime', this.calculateTotalTime());   
  },

  calculateTotalTime: function(){
    var length = parseInt(this.get('pomodoros').length),
        duration = parseInt(this.get('duration')),
        totalTimeInMin = length * duration,
        hours = Math.floor(totalTimeInMin/60),
        min = totalTimeInMin % 60;
    return hours+'h'+min+'m'
  },
  saveOnFile: function(){
    var json = {tasks : []}, data = this.store.find('task');
        i = 0, _this = this;
    this.store.find('task').then(function(tasks){
      tasks.forEach(function(task){
        _this.createPomodoroArrayIfUnd(task);
        json.tasks.push(
                   _this.createJsonString(task, i++));
      });
      jsonio.save(JSON.stringify(json));
    });
  },
  createPomodoroArrayIfUnd: function(task){
   if(task.get("pomodoros") == undefined){
    var pomodoroArray = []; 
    task.set('pomodoros', pomodoroArray);
   }
  },
  createJsonString: function(task, index){
    var tmp = {id: index,
        name: task.get("name"),
        creation_date: task.get('creation_date'),
        last_active: task.get('last_active'),
        duration: task.get("duration"),
        pomodoros: task.get("pomodoros")};
    return tmp
  },
  formatDates: function(){
    this.set('formated_creation_date', this.formatDate('creation_date'));
    this.set('formated_last_active', this.formatDate('last_active'));
  },
  formatDate: function(unformatedDate){
    var arr = this.get('creation_date').split('|'),
        date = arr[0];
    return arr[0]+' '+arr[1]+'h'+arr[2]+'m';
  }
});

App.resetFixtures = function() {
  jsonio.setFile("data.json");
  App.Task.FIXTURES = $.map(jsonio.read(), 
                      function(el) { return el; });
};

App.resetFixtures();

App.ApplicationRoute = Ember.Route.extend({
  taskVisibility: true,
  model: function() {
    return this.store.find('task');
  },
  actions: {
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
      _this = this;
      $('#clock-container').hide('slow/400/fast');
      this.transitionTo('tasks.statistics').then(function(){
        appWindow.resize(900, 640); 
        _this.store.find('task').then(function(tasks){
          statistics.getStatistics(tasks, 7); 
        });
      }); 
    },
    setPeriod: function(period){
      _this = this;
      this.store.find('task').then(function(tasks){
        statistics.getStatistics(tasks, period);
      });
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
    selectTask: function(id){
      pomodoroClock.stop();
      currentSelected = id;
      var currentSelectedDuration;
      var _this = this;
      this.store.find('task', id).then(function(task){
       currentSelectedDuration = task.get('duration');
       task.set('last_active', new Date().getDateString());
       pomodoroTime = parseInt(currentSelectedDuration) * 60;
       pomodoroClock.reset(pomodoroTime);
       $('#task-name').html("<h4>"+task.get('name')+"</h4>");
       $('#task-status').html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
      });
    },
  }
});

App.TasksRoute = Ember.Route.extend({
  model: function(){
    return this.store.find('task');
  }
});

App.TasksIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('task');
  }
});

App.TasksIndexController = Ember.ArrayController.extend({
  needs: ['tasks'],
  sortProperties: ['name']
});

App.TasksEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('task', params.task_id);
  },
  // Roll back if the user transitions away by clicking a link, clicking the
  // browser's back button, or otherwise.
  deactivate: function() {
    var model = this.modelFor('tasks.edit');
    if (model && model.get('isDirty') && !model.get('isSaving')) {
      model.rollback();
    }
  }
});

App.TasksNewRoute = Ember.Route.extend({
  model: function() {
    newTask = this.store.createRecord('task'); 
    return newTask;
  },

  isNew: true,

  renderTemplate: function(controller, model) {
    this.render('tasks.edit', {
      controller: controller
    });
  },

  // Roll back if the user transitions away by clicking a link, clicking the
  // browser's back button, or otherwise.
  deactivate: function() {
    var model = this.modelFor('tasks.new');
    if (model && model.get('isNew') && !model.get('isSaving')) {
      model.destroyRecord();
    }
  }
});


App.IndexView = Ember.View.extend({
  streak: 0,
  didInsertElement: function(){
    this.controller.transitionToRoute('tasks');
    clock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: function() {
          if(pause == true){
            $('#task-status').html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
            return;
          }
          if(restart == true){
            pomodoroClock.reset(pomodoroTime);
            pomodoroClock.start();
            $('#task-status').html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');
            restart = false;
            return;
          }
          intervalCount++;
          $('#streak').html(intervalCount);
          $('#task-status').html('<h4 class="clock-interval animated infinite pulse">[Interval]</h4>');
          // $('.message').html('intervalo! '+intervalCount);
          (intervalCount > 2) ? longInterval() : 
          shortInterval();
        }
      }
      }); 
    pomodoroClock = new PomodoroClock();
    clock.setCountdown(true);
    clock.setTime(pomodoroTime);
  }
});

function longInterval(){
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  intervalCount = 0;
  pomodoroClock.reset(longIntervalTime);
  pomodoroClock.start();
}

function shortInterval(){
  var controller = App.__container__.lookup("controller:application");
  controller.send('savePomodoro','External');
  restart = true;
  pomodoroClock.reset(shortIntervalTime);
  pomodoroClock.start();
}

App.ApplicationController = Ember.ObjectController.extend({
  
  actions: {
    startClock: function() {
      if(currentSelected != -1){
        $('#task-status').html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');
        pomodoroClock.start();
      }else{
        alert("first select a task in the list :D");
      }
    },
    stopClock: function() {
      pomodoroClock.stop();
    }
  }
});

// var App = Ember.Application.create();

// App.ApplicationRoute = Ember.Route.extend({
//   actions: {
//     openModal: function(modalName, model) {
//       this.controllerFor(modalName).set('model', model);
//       return this.render(modalName, {
//         into: 'application',
//         outlet: 'modal'
//       });
//     },
    
//     closeModal: function() {
//       return this.disconnectOutlet({
//         outlet: 'modal',
//         parentView: 'application'
//       });
//     }
//   }
// });

// App.IndexRoute = Ember.Route.extend({
//   model: function() {
//     return Em.Object.create({name: 'Mitch'});
//   }
// });

App.ModalController = Ember.ObjectController.extend({
  actions: {
    close: function() {
      return this.send('closeModal');
    }
  }
});

// App.ModalDialogComponent = Ember.Component.extend({
//   actions: {
//     close: function() {
//       return this.sendAction();
//     }
//   }
// });






