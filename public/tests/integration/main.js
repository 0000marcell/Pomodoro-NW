// Tasks Table
test('Iteration through tasks', function(assert) {
  visit('/');
  andThen(function(){
    assert.ok(find('.scrollable .row').length > 1, "tasks table didn't load properly");
  }); 
});

test('Select a task', function(assert){
  visit('/');  
  click($('.task-name').click());
  andThen(() => {
    assert.notEqual($('#task-name').text(), 'No Task Selected!');
  });
});
