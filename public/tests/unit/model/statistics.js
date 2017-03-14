moduleForModel('task', 'Task Model');

function createTasks(_this, taskN, pomN){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let arr = [],
      pomodoros = [];
      
  for (let i = 1; i < pomN; i++) {
    pomodoros.push({date: `0${i}/12/2016|21|9|38`}); 
  }
  for (let i = 0; i < taskN; i++) {
    console.log(`looping ${i}`);
    arr.push(_this.subject({ name: `Task ${i}`, 
      pomodoros: pomodoros})); 
  }
  debugger;
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
        'label': ['Task 1', 'Task 2'],  
        'values': [
          {  
            'label': 'Task 1',  
            'values': [50]  
          },   
          {  
            'label': 'Task 2',  
            'values': [50]  
          } 
        ]
      },
     tasks = createTasks(this, 2, 10),
     result = statistics.createJsonStatistics(tasks);
  assert.deepEqual(result, json);
});
