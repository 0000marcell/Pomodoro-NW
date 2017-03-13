moduleForModel('task', 'Task Model');

function createTasks(_this){
  let arr = [],
      pomodoros = [];
  for (var i = 1; i < 11; i++) {
    pomodoros.push({date: `0${i}/12/2016|21|9|38`}); 
  }
  for (var i = 0; i < 10; i++) {
    arr.push(_this.subject({ name: `Task ${i}`, 
      pomodoros: pomodoros})); 
  }
  return arr;
}

test('load the tasks in the statistics object', function(assert){
  let tasks = createTasks(this);
  statistics.init(tasks);
  assert.equal(statistics.filteredTasks[0].get('name'), 'Task 0');
  assert.equal(statistics.tasks[0].get('name'), 'Task 0');
});

test('return the total time spend in a task', function(assert){
  let tasks = createTasks(this),
      result = statistics.calculateTaskTotalTime(tasks[0]);
  assert.equal(result, 5);
});

test('include task time', function(assert){
  statistics.includeTaskTime('task 01', '5 h'); 
  statistics.includeTaskTime('task 02', '15 h');
  assert.equal(statistics.tasksTotalTime[0].taskName, 'task 01');
  assert.equal(statistics.tasksTotalTime[1].taskName, 'task 02');
});
