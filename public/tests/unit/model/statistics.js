moduleForModel('task', 'Task Model');

App.TaskObject = Ember.Object.extend({
  name: null,
  pomodoros: []
});

function createTasks(_this, taskN, pomN){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let arr = [],
      pomodoros = [];
      
  for (let i = 1; i < pomN; i++) {
    pomodoros.push({date: `0${i}/12/2016|21|9|38`}); 
  }
  for (let i = 0; i < taskN; i++) {
    arr.push(App.TaskObject.create({ name: `Task ${i}`, 
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

test('create json statistics for the jit graph', function(assert){
  let json = {  
        'label': ['Task 0', 'Task 1'],  
        'values': [
          {  
            'label': 'Task 0',  
            'values': [5]  
          },   
          {  
            'label': 'Task 1',  
            'values': [5]  
          } 
        ]
      },
     tasks = createTasks(this, 2, 10),
     result = statistics.createJsonStatistics(tasks);
  assert.deepEqual(result, json);
});
