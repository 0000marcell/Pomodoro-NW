moduleForModel('task', 'Task Model');

function createTasks(_this){
  let arr = [];
  for (var i = 0; i < 10; i++) {
    arr.push(_this.subject({ name: `Task ${i}`  })); 
  }
  return arr;
}

test('load the tasks in the statistics object', function(assert){
  let tasks = createTasks(this);
  statistics.init(tasks);
  assert.equal(statistics.filteredTasks[0].get('name'), 'Task 0');
  assert.equal(statistics.tasks[0].get('name'), 'Task 0');
});
