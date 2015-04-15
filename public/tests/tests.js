App.rootElement = '#ember-testing';

setResolver(Ember.DefaultResolver.create({namespace: App}));
App.setupForTesting();
App.injectTestHelpers();

module("Integration tests", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    App.reset();
  }
});
/*  
  Integration tests
*/

// Page load
test("/", function() {
  visit("/");
  andThen(function() {
    equal($('#load-test').html(), 'testing', "Page loaded");
  });
});

// Back button

test('Go back to the main page!', function() {
  visit('/');
  click('#button-main');
  andThen(function() {
    equal(currentRouteName(), 'tasks.index');
  });
});

// Config button 
test('Go to the config page!', function() {
  visit('/');
  click('#button-config');
  andThen(function() {
    equal(currentRouteName(), 'config');
  });
});

//Statistics Button
test('Go to the statistics page!', function() {
  visit('/');
  click('#button-statistics');
  andThen(function() {
    equal(currentRouteName(), 'tasks.statistics');
  });
});

// Tasks Table
test('Iteration through tasks', function(assert) {
  visit('/');
  andThen(function(){
    assert.ok(find('tbody tr').length >= 1, "taks_index didn't load properly");
  }); 
});

/*
   Unit Tests
*/
module('Unit:');

moduleForModel('task', 'Task Model');

test('Testing setTotalTime in App.Task', function() {
  // this.subject aliases the createRecord method on the model
  var task = this.subject({ totalTime: 4 });
  Ember.run(function() {
    task.set('pomodoros', ['1', '1', '1']);
    task.set('duration', '25:00');
    task.setTotalTime();
  });
  equal(task.get('totalTime'), '1h15m');
});

test('Testing generateJSON in App.Task', function(){
  var task = App.__container__.lookup('model:task');
  var json = task.generateJSON();
  alert('json '+json.tasks[0].name);
  equal(null, null);
});







