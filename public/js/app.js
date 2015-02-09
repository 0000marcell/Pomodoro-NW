var clock;
var intervalCount = 0;
var pomodoroTime = 25 * 60;
var restart = false;
var shortIntervalTime = 2;
var longIntervalTime = 3;
var pause = false;
var pomodoroClock;
var jsonio;
var statistics = new PomodoroStatistics();
var currentSelected = -1;
var newTask;

App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  namespace: 'Pomodoro-Grunt-Node'
});

Ember.EasyForm.Config.registerWrapper('bootstrap', {
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
  last_active: DS.attr('string'),
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
  durations : ['55:00','1:00', '0.1', '50:00','45:00','40:00','35:00','30:00','25:00',
    '20:00'
  ]
});

App.resetFixtures = function() {
  jsonio = new JSONIO();
  jsonio.setFile("data.json");
  App.Task.FIXTURES = $.map(jsonio.read(), function(el) { return el; });
};

App.resetFixtures();

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('task');
  },
  actions: {
    // Redirect to new form.
    new: function() {
      this.transitionTo('tasks.new');
    },
    // Redirect to edit form.
    edit: function(task) {
      this.transitionTo('tasks.edit', task);
    },
    show: function(task){
      var length = parseInt(task.get('pomodoros').length);
      var duration = parseInt(task.get('duration')); 
      var totalTimeInMin = length * duration;
      console.log("total time in min "+totalTimeInMin);
      var hours = Math.floor(totalTimeInMin/60);
      var min = totalTimeInMin % 60;
      console.log("task show !!!"+task.get('pomodoros').length);
      task.set('totalTime', hours+'h'+min+'m'); 
      this.transitionTo('tasks.show', task);
    },
    // Save and transition to /tasks/:task_id only if validation passes.
    save: function(task) {
      var _this = this;
      task.validate().then(function() {
        task.save();
        var date = _this.get("getCurrentDate").call(this);
        task.set('creation_date', date);
        _this.send("saveIntoFile");
        _this.transitionTo('index');
      });
    },
    statistics: function(){
      _this = this;
      this.transitionTo('tasks.statistics').then(function(){
        _this.store.find('task').then(function(tasks){
          statistics.lastWeek(tasks);   
        });
      }); 
    },
    main: function(){
     this.transitionTo('tasks');  
    },
    saveIntoFile: function(){
      var json = {tasks : []};
      var data = this.store.find('task');
      var jsonString;
      var i = 0;
      var _this = this;
      this.store.find('task').then(function(tasks){
        tasks.forEach(function(task){
          var tmp = {id: i++,
            name: task.get("name"),
            creation_date: task.get('creation_date'),
            last_active: task.get('last_active'),
            duration: task.get("duration"),
            pomodoros: task.get("pomodoros")};
          console.log("pomodoros in save in to file "+task.get('pomodoros'));
          json.tasks.push(tmp);
          jsonString = JSON.stringify(json);
        });
        console.log("gonna save jsonio!");
        jsonio.save(jsonString);
      });
    },
    savePomodoro: function(){
      var _this = this;
      this.store.find('task', currentSelected).then(function(task){
        var date = _this.get("getCurrentDate").call(this); 
        var pomodoro = { "date": date };
        console.log("pomodoros type before "+task.get('pomodoros'));
        console.log("pomodoros length before "+task.get('pomodoros').length);
        task.get('pomodoros').pushObject(pomodoro);
        console.log("length after from object "+task.get('pomodoros').length);
        task.save().then(function(){
         console.log("gonna save task into file!");
         _this.send('saveIntoFile');
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
       _this.send("saveIntoFile");
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
       task.set('last_active', _this.get("getCurrentDate").call(this));
       pomodoroTime = parseInt(currentSelectedDuration) * 5;
       pomodoroClock.reset(pomodoroTime);
      });
    },
  },
  getCurrentDate: function(){
    var today = new Date();
    var S = today.getSeconds(); 
    var M = today.getMinutes(); 
    var H = today.getHours();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    today = mm+'/'+dd+'/'+yyyy+'|'+H+'|'+M+'|'+S;
    return today;
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
  didInsertElement: function(){
    this.controller.transitionToRoute('tasks');
    clock = $('.clock').FlipClock({
      clockFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: function() {
          if(pause == true){
            return;
          }
          if(restart == true){
            pomodoroClock.reset(pomodoroTime);
            pomodoroClock.start();
            restart = false;
            return;
          }
          intervalCount++;
          $('.message').html('intervalo! '+intervalCount);
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








