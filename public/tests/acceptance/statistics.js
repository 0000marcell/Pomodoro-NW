test("can access statistics page", function() {
  visit("statistics");
  andThen(function() {
    debugger;
    equal(currentURL(), "/statistics");
  });
});

test('can see all the tests done week/day', function(assert){
  visit("/statistics"); 
  andThen(() => {
    assert.equal($('#test-today-tasks h6')[0].text(),
      10);
    assert.equal($('#test-today-tasks h6')[0].text(), 10);
  });
});

test('show the list of the tests of the week', function(assert){
  visit("/statistics"); 
  andThen(() => {
    assert.equal($('#test-week-list li')[0].length,
      5);
  });
});

test('Show the total of the week and today', function(assert){
  visit("/statistics"); 
  andThen(() => {
    assert.equal($('#test-week-tasks h6')[0].text(),
      'This week: 10');
    assert.equal($('#test-week-tasks h6')[0].text(), 
      'Today tasks: 10');
  }); 
});

test('Show a list of all the today pomodoros', function(assert){
  visit("/statistics"); 
  andThen(() => {
    assert.equal($('#test-today-list li')[0].length,
      5);
  });
});
/*
test('Show pom average', function(assert){
  visit("/statistics"); 
  andThen(() => {
    assert.equal($('#test-pom-average')text(),
      4);
  });
});
*/
