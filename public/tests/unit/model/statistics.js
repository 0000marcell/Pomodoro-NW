moduleForModel('task', 'Task Model');

let jsonStatistics = {  
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
};

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
    arr.push(App.TaskObject.create({ id: i+1, name: `Task ${i}`, 
      pomodoros: pomodoros})); 
  }
  return arr;
}

test('#init load the tasks in the statistics object', function(assert){
  let tasks = createTasks(this);
  statistics.init(tasks);
  assert.equal(statistics.filteredTasks[0].get('name'), 'Task 0');
  assert.equal(statistics.tasks[0].get('name'), 'Task 0');
});

test('#calculateTasksTotalTime return the total time spend in a task', function(assert){
  let tasks = createTasks(this),
      result = statistics.calculateTaskTotalTime(tasks[0]);
  assert.equal(result, 5);
});



test('#includeTaskTime include task time', function(assert){
  statistics.includeTaskTime('task 01', '5 h'); 
  statistics.includeTaskTime('task 02', '15 h');
  assert.equal(statistics.tasksTotalTime[0].taskName, 'task 01');
  assert.equal(statistics.tasksTotalTime[1].taskName, 'task 02');
});

test('#createJsonStatistics for the jit graph', function(assert){
  let tasks = createTasks(this, 2, 10),
     result = statistics.createJsonStatistics(tasks);
  assert.deepEqual(result, jsonStatistics);
});

test('#calculateTasksPercentage', function(assert){
  let expectedResult = {
    'label': ['Task 0', 'Task 1'],  
    'values': [
      {  
        'label': 'Task 0',  
        'values': [50]  
      },   
      {  
        'label': 'Task 1',  
        'values': [50]  
      } 
    ]
  };
  let result = statistics
    .calculateTasksPercentage(jsonStatistics);
  assert.deepEqual(result, expectedResult);
});

test('#filterTasks filter tasks with id 1', function(assert){
  let tasks = createTasks(this, 10, 10);
  let result = statistics.filterTasks([2, 3, 5]);
  debugger;
});
