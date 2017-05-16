function createTasks() {
  let obj = {tasks: []};  
  for (let i = 1; i < 6; i++) {
    obj.tasks.push({id: i+'', name: `Task ${i}`, 
      description: `description ${i}`,
      pomodoros: []}); 
    for (let j = 1; j < 6; j++) {
      obj.tasks[i - 1]
        .pomodoros.push({date: new Date()});
    }
  }
  return obj;
}

export default createTasks();
