App.rootElement = '#ember-testing';


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

// // New Button
// test('Go to the new page!', function() {
//   visit('/');
//   click('#button-new');
//   andThen(function() {
//     equal(currentRouteName(), 'tasks.edit');
//   });
// });

// Tasks Table
test('Iteration through tasks', function(assert) {
  visit('/');
  andThen(function(){
    assert.ok(find('tbody tr').length >= 1, "taks_index didn't load properly");
  }); 
});



// Show and hide button
// test('Testing show/hide button', function(assert) {
//   visit('/');
//   click('#button-show-hide-tasks');
//   andThen(function() {
//     console.log(find('tbody tr').length);
//     assert.ok(find('tbody tr').length == 0, "tasks_index didn't hide properly");
//   });
// });

/*
   Unit Tests
*/

module('Unit:');

test('Testing show method', function(){
  var app = App.ApplicationRoute.create();
  app.set('foo', 'baz');
  app.testMethod();
  equal(app.get('foo'), 'baz');
});







