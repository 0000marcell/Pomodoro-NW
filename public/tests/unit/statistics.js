module('Unit: Statistics');

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

test('#calculateTasksTotalTime return the total time spend in a task', function(assert){
  let tasks = createTasks(),
      result = statistics.calculateTaskTotalTime(tasks[0]);
  assert.equal(result, 5);
});

test('#includeTaskTime include task time', function(assert){
  statistics.includeTaskTime('task 01', '5 h'); 
  statistics.includeTaskTime('task 02', '15 h');
  assert.equal(statistics.get('tasksTotalTime')[0].name, 'task 01');
  assert.equal(statistics.get('tasksTotalTime')[1].name, 'task 02');
});

test('#createJsonStatistics for the jit graph', function(assert){
  let tasks = createTasks(2, 10),
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
  let tasks = createTasks(10, 10);
  let result = statistics.filterTasks(tasks, [2, 3, 5]);
  assert.equal(result.length, 3);
  assert.equal(result[0].get('name'), 'Task 1');
  assert.equal(result[1].get('name'), 'Task 2');
  assert.equal(result[2].get('name'), 'Task 4');
});

test('#firstPomodoro', function(assert){
  let tasks = createTasks(10, 10),
      result = statistics.firstPomodoro(tasks);
  assert.equal(result.getDate(), 1);
});

test('#firstPomodoro also works after a filter', function(assert){
  let tasks = createTasks(2, 10),
      startDate = '04/12/2016',
      endDate = '07/12/2016';
  let filteredTasks = statistics.filterPomodoros(tasks, startDate, endDate),
      result = statistics.firstPomodoro(filteredTasks);
  assert.equal(result.getDate(), 4);
});

test('#lastPomodoro', function(assert){
  let tasks = createTasks(10, 10),
      result = statistics.lastPomodoro(tasks);
  assert.equal(result.getDate(), 10);
});

test('#lastPomodoro also works after filter', function(assert){
  let tasks = createTasks(2, 10),
      startDate = '04/12/2016',
      endDate = '07/12/2016';
  let filteredTasks = statistics.filterPomodoros(tasks, startDate, endDate),
      result = statistics.lastPomodoro(filteredTasks);
  assert.equal(result.getDate(), 7);
});

test('#getPomodorosDateRange', function(assert){
  let tasks = createTasks(1, 10),
      startDate = new Date(2016, 11, 4),
      endDate = new Date(2016, 11, 7),
      result = statistics.getPomodorosDateRange(tasks[0], 
        startDate, endDate);
  assert.equal(result.pomodoros[0].date.getDate(), 4);
  assert.equal(result.pomodoros[3].date.getDate(), 7);
});

test('#filterPomodoros', function(assert){
  let tasks = createTasks(2, 10),
      startDate = '04/12/2016',
      endDate = '07/12/2016';
  let result = statistics.filterPomodoros(tasks, startDate, endDate);
  assert.equal(result[0].pomodoros[0].date.getDate(), 4);
  assert.equal(result[1].pomodoros[3].date.getDate(), 7);
});

test('#mostProductiveMonth', function(assert){
  let tasks = createTasks(2, 10),
      result = statistics.mostProductiveMonth(tasks, 2016); 
  assert.equal(result.month, 'December');
  assert.equal(result.size, 20);
});

test('#lastDayMonth', function(assert){
  let result = statistics.lastDayMonth(2, 2016);  
  assert.equal(result, '29');
});

test('#todayPomodoros', function(assert){
  let tasks = tasksDate(10, 2, true);
  let result = statistics.todayPomodoros(tasks); 
  assert
    .equal(result.filterBy('name', 'total').objectAt(0).time, 10);
});

test('#weekPomodoroH', function(assert){
  let tasks = tasksDate(10, 2);
  let result = statistics.weekPomodoroH(tasks); 
  assert
    .equal(result.filterBy('name', 'total').objectAt(0).time, 10);
});

test('#pomAverage', function(assert){
  let tasks = tasksDate(10, 2),
      result = statistics.pomAverage(tasks); 
  assert.equal(result, 10);
});
