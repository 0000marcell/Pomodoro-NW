var clock;
var intervalCount = 0;
var pomodoroTime = 25 * 60;
var restart = false;
var shortIntervalTime = 2;
var longIntervalTime = 3;
var pause = false;
var pomodoroClock;
var jsonio;
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
  });
});

App.Task = DS.Model.extend(Ember.Validations.Mixin, {
  name: DS.attr('string'),
  type: DS.attr('string'),
  pomodoros: DS.attr('string'),
  duration: DS.attr('string'),
  
  // To identify html tag for a task.
  htmlID: function() {
    return 'task' + this.get('id');
  }.property('id'),

  validations: {
    name: {
      presence: true
    }
  },
  durations : ['55:00','1:00','50:00','45:00','40:00','35:00','30:00','25:00',
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
    // Save and transition to /tasks/:task_id only if validation passes.
    save: function(task) {
      var _this = this;
      task.validate().then(function() {
        task.save();
        _this.send("saveIntoFile");
        _this.transitionTo('index');
      });
    },
    saveIntoFile: function(){
      var json = {tasks : []};
      var data = this.store.find('task');
      var jsonString;
      var i = 0;
      var _this = this;
      this.store.find('task').then(function(data){
        data.forEach(function(value) {
          var tmp = {id: i++,
            name: value.get("name"),
            type: value.get('type'),
            duration: value.get("duration"),
            pomodoros: value.get("pomodoros")};
          json.tasks.push(tmp);
          jsonString = JSON.stringify(json);
        });
        jsonio.save(jsonString);
      });
    },
    savePomodoro: function(){
      var _this = this;
      this.store.find('task', currentSelected).then(function(task){
        task.incrementProperty('pomodoros');
        var currentPomodoros = task.get('pomodoros');
        _this.send('saveIntoFile');
      });
    },
    // Roll back and transition to /tasks/:task_id.
    cancel: function(task) {
      task.rollback();
      this.transitionTo('tasks');
    },

    // Delete specified task.
    delete: function(task) {
      var _this = this;
      task.destroyRecord().then(function(){
       _this.send("saveIntoFile");
      });
      this.transitionTo('tasks');
    },
    selectTask: function(id){
      currentSelected = id;
      var currentSelectedDuration;
      this.store.find('task', id).then(function(task){
       currentSelectedDuration = task.get('duration');
       pomodoroTime = parseInt(currentSelectedDuration) * 60;
       pomodoroClock.reset(pomodoroTime);
      });
    }
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







