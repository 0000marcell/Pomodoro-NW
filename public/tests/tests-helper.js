function createTasks(taskN, pomN){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let arr = [],
      pomodoros = [],
      fullYear = new Date().getFullYear() - 1;
  for (let i = 1; i < pomN; i++) {
    pomodoros.push({date: new Date(fullYear, 0, i)}); 
  }

  for (let i = 0; i < taskN; i++) {
    arr.push(App.TaskObject.create({ id: i+1, name: `Task ${i}`, 
      pomodoros: pomodoros, 
      disabled: (i%2) ? true : false})); 
  }
  return arr;
}

function tasksDate(taskN, pomN, onlyToday = false){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let tasks = [],
      pomodoros = [],
      date = null,
      monday = utils.getMonday(new Date()).getDate();
  for (let i = 1; i < pomN; i++) {
    date = new Date();
    if(!onlyToday){
      date.setDate(monday + i);
      date.setMonth(utils.getMonday(new Date()).getMonth());
    }    
    pomodoros.push({date: date}); 
  }
  for (let i = 0; i < taskN; i++) {
    tasks.push(App.TaskObject.create({ id: i+1, name: `Task ${i}`, 
      pomodoros: pomodoros})); 
  }
  return tasks;
}
