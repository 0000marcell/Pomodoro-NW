function PomodoroStatistics(){
}

PomodoroStatistics.prototype.lastWeek = function(tasks){
  console.log("tasks "+tasks);
  var today = new Date();
  var dd = today.getDate();
  var lastWeek = dd-7;
  var totalTime = 0;
  var name;
  var duration;
  var date;
  var json = { 'label': [],
        'values': []
    };
  json.label.push('Total');
  _this = this;
  console.log("gonna iterate though tasks ");
  tasks.forEach(function(task){
    name = task.get("name");
    console.log("task name "+name);
    duration = parseInt(task.get('duration')); 
    var taskTime = 0;
    json.label.push(task.get("name"));
    var taskObj = { 'label': task.get("name"), 'values':[]}; 
    for (var i = 0; i < task.get('pomodoros').length; i++){
      date = task.get('pomodoros')[i].date; 
      if(_this.isInRange(date, 'day', lastWeek)){
        taskTime += 60 * duration;
      }
    };
    totalTime += parseInt(taskTime);
    taskObj.values.push(taskTime);
    json.values.pushObject(taskObj);
  });
  var taskObj = { 'label': 'Total', 'values':[totalTime]};
  json.values.pushObject(taskObj); 
  for (var i = 0; i < json.values.length; i++){
    taskTime = json.values[i].values[0];
    json.values[i].values = []; 
    if(i > 0){
      for (var c = 0; c < i; c++) {
        json.values[i].values.push(0);  
      };
    }
    var percentage = 100/(totalTime/taskTime);
    json.values[i].values.push(percentage);
  };
  console.log("final json "+JSON.stringify(json));
  init(json);
};

PomodoroStatistics.prototype.isInRange = function(date, type, last){
 var day = this.getDateIn(date, 'day');
 if(day >= last){
  return true;
 }else{
  return false;
 }
}

PomodoroStatistics.prototype.getDateIn = function(date, type){
  var result = date.split('/');
  if(type == 'month'){
    return result[0];
  }
  if(type == 'day'){
    return result[1];
  }
}




