// Tasks Table
test('Iteration through tasks', function(assert) {
  visit('/');
  andThen(function(){
    assert.ok(find('.scrollable .row').length > 1, "tasks table didn't load properly");
  }); 
});

test('Select a task', function(assert){
  visit('/');  
  andThen(() => {
    click($('.task-name').first());
    andThen(() => {
      assert.notEqual($('#task-name').text(), 'No Task Selected!');
    });
  });
});

test('Dont start the clock if no task is selected', function(assert){
  visit('/');
  andThen(() => {
    click('#test-clock-start'); 
    andThen(() => {
      assert.equal($('#task-name h4').text(), 'First select a task!');
      assert.equal($('#task-status').text().trim(), '[Paused]');
    });
  });
});
