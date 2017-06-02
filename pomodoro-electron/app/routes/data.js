let obj = {tasks: [], 
  tags: [{id: 1, name: 'work', 
    description: 'work!', color: '#ff00ff', active: true},
    {id: 2, name: 'learning', description: 'learning!',
      color: '#fff00', active: true}],
  colors: [{id: 1, value: '#F44336'}, 
    {id: 2, value: '#E91E63'},
    {id: 3, value: '#9C27B0'}]};  

function createTasks() {
  for (let i = 1; i < 6; i++) {
    obj.tasks.push({id: i+'', name: `Task ${i}`, 
      description: `description ${i}`,
      pomodoros: [], tag: null, active: true}); 
    for (let j = 1; j < 6; j++) {
      obj.tasks[i - 1]
        .pomodoros.push({date: new Date()});
    }
  }
  return obj;
}

export default createTasks();
