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