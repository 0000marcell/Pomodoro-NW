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
  click('#test-main-button');
  andThen(function() {
    equal(currentRouteName(), 'main');
  });
});

// Config button 
test('Go to the config page!', function() {
  visit('/');
  click('#test-config-button');
  andThen(function() {
    equal(currentRouteName(), 'config');
  });
});

//Statistics Button
test('Go to the statistics page!', function() {
  visit('/');
  click('#test-statistics-button');
  andThen(function() {
    equal(currentRouteName(), 'statistics');
  });
});

// Tasks Table
test('Iteration through tasks', function(assert) {
  visit('/');
  andThen(function(){
    assert.ok(find('.scrollable .row').length > 1, "tasks table didn't load properly");
  }); 
});
