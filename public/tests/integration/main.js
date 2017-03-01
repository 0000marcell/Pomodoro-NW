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

test('start the clock if a task is selected', function(assert){
  visit('/');
  andThen(() => {
    click($('.task-name').first());
    andThen(() => {
      click('#test-clock-start'); 
      let time = $('.flip').text();
      andThen(() => {
        assert.equal($('#task-status').text().trim(), '[Active]');
        assert.notEqual($('.flip').text(), time);
      });    
    });
  }); 
});

test('can stop the clock after starting it', function(assert){
  visit('/');
  andThen(() => {
    debugger;
    clock.timer.on('start', () => {
      alert('the clock started');
    });
    click($('.task-name').first());
    andThen(() => {
      click('#test-clock-start'); 
      //let time = $('.flip').text();
      andThen(() => {
        assert.equal($('#task-status').text().trim(), '[Active]');
        //assert.notEqual($('.flip').text(), time);
        click('#test-clock-stop');
        time = $('.flip').text();
        andThen(() => {
           assert.equal(time, $('.flip').text());
        });
      });    
    });
  }); 
});
