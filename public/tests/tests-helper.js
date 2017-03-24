function createTasks(taskN, pomN){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let arr = [],
      pomodoros = [];
        
  for (let i = 1; i < pomN; i++) {
    pomodoros.push({date: `0${i}/12/2016|21|9|38`}); 
  }

  for (let i = 0; i < taskN; i++) {
    arr.push(App.TaskObject.create({ id: i+1, name: `Task ${i}`, 
      pomodoros: pomodoros })); 
  }
  return arr;
}

function tasksDate(taskN, pomN, onlyToday = false){
  pomN = pomN + 1 || 11;
  taskN = taskN || 10;
  let tasks = [],
      pomodoros = [],
      date = new Date(),
      monday = utils.getMonday(new Date()).getDate(),
      dateS;
  for (let i = 1; i < pomN; i++) {
    if(onlyToday){
      dateS = utils.transformDateToString(date); 
    }else{
      date.setDate(monday + i);
      dateS = utils.transformDateToString(date);
    }
    pomodoros.push({date: `${dateS}|21|9|38`}); 
  }
  for (let i = 0; i < taskN; i++) {
    tasks.push(App.TaskObject.create({ id: i+1, name: `Task ${i}`, 
      pomodoros: pomodoros})); 
  }
  return tasks;
}
