/*
   Unit Tests
*/
module('Unit:');

moduleForModel('task', 'Task Model');

test('Testing htmlID in App.Task', function(assert){  
  visit('/');
  andThen(function(){
    assert.ok(find('tbody tr').attr('id') == 'task0');
  });
});

test('Testing setTotalTime in App.Task', function() {
  var task = this.subject({ totalTime: 4 });
  Ember.run(function() {
    task.set('pomodoros', ['1', '1', '1']);
    task.set('duration', '25:00');
    task.setTotalTime();
  });
  equal(task.get('totalTime'), '1h15m');
});

test('Testing generateJSON in App.Task', function(){
  var task = this.subject({ totalTime: 4}), 
      json;
  Ember.run(function() {
    task.set('name', 'task_name');
    json = task.generateJSON();
  }); 
  equal(JSON.stringify(json), "{\"tasks\":[]}");
});

test('Testing createPomodoroArrayIfUnd App.Task', function(){  
  var task = this.subject({ pomodoros: ''}),
      pomodoros;
  Ember.run(function() {
    task.createPomodoroArrayIfUnd();
    pomodoros = task.get("pomodoros");
  });
  equal(pomodoros, 'undefined');
});

test('Testing createJsonString App.Task', function(){  
});


test('Testing formatDates App.Task', function(){  
});

test('Testing formatDate App.Task', function(){  
});

