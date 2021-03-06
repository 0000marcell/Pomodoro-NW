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
      assert.notEqual($('#selected-task').text(), 'No Task Selected!');
    });
  });
});

test('Dont start the clock if no task is selected', function(assert){
  visit('/');
  andThen(() => {
    click('#test-clock-start'); 
    andThen(() => {
      assert.equal($('#selected-task').text(), 'First select a task!');
      assert.equal($('#task-status').text().trim(), '[Paused]');
    });
  });
});

test('start/stop the clock if a task is selected', function(assert){
  visit('/');
  andThen(() => {
    click($('.task-name').first());
    andThen(() => {
      click('#test-clock-start'); 
      andThen(() => {
        assert.equal($('#task-status').text().trim(), '[Active]');
        Ember.run.later(this, () => {
          assert.equal(1497, clock.time.time);
          click('#test-clock-stop');
          andThen(() => {
            Ember.run.later(this, () => {
              assert.equal(1497, clock.time.time);
            }, 1000);
          });
        }, 1000);
      });    
    });
  }); 
});
