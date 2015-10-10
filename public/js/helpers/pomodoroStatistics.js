function PomodoroStatistics(){
}

PomodoroStatistics.prototype.initialize = function(){
  this.pomodoroDate, this.lastDate,
  this.jsonStatistics = { 'label': ['Total'],
                'values': []
            };
  this.totalTime = 0, this.taskDuration, this.taskName,
  this.taskObj, this.task, this.taskTime, this.period;
}

PomodoroStatistics.prototype.getStatistics = function(tasks, period){
  this.initialize();
  this.period = period;
  $('#total-time-tasks').empty(); 
  this.setPeriod();
  this.createJsonStatistics(tasks);
};

PomodoroStatistics.prototype.createJsonStatistics = function(tasks){
  _this = this;
  tasks.forEach(function(task){
    _this.task = task;
    if(_this.abortIfPomodorosEmpty())
      return;
    _this.getTaskTotalTime();
    console.log("this task time "+_this.taskTime);
    if(typeof _this.taskTime === 'undefined' ||
       _this.taskTime.toString() == 0)
      return;
    console.log("task time before create obj "+_this.taskTime.toString());
    _this.createTaskObj();
    _this.includeTaskTime(_this.taskTime.toString(),
                          _this.name);
    _this.includeTaskObjInJsonStats();
  }); 
  this.includeTaskTime(_this.totalTime.toString(), 
                        'Total');
  this.includeTotalTimeObj();
  this.calculateTasksPercentage();
  this.loadStatistics();
};

PomodoroStatistics.prototype.loadStatistics = function(){
  $('#infovis').empty();
  init(this.jsonStatistics);
}

PomodoroStatistics.prototype.calculateTasksPercentage = function(){
  for(var i = 0; i < this.jsonStatistics.values.length; i++){
    this.taskTime = this.jsonStatistics.values[i].values[0];
    this.jsonStatistics.values[i].values = []; 
    if(i > 0){
      for (var c = 0; c < i; c++) {
        this.jsonStatistics.values[i].values.push(0);  
      };
    }
    var percentage = Math.round(100/(this.totalTime/this.taskTime));
    if(!percentage)
      percentage = 0
    this.jsonStatistics.values[i].values.push(percentage);
  };
}

PomodoroStatistics.prototype.includeTotalTimeObj = function(){
  var taskObj = { 'label': 'Total', 'values':[this.totalTime]};
  this.jsonStatistics.values.pushObject(taskObj);
}

PomodoroStatistics.prototype.getTaskTotalTime = function(){
  this.taskDuration = parseInt(this.task.get('duration')); 
  console.log("task duration "+this.taskDuration);
  this.taskTime = 0;
  for(var i = 0; i < this.task.get('pomodoros').length; i++){
    this.pomodoroDate = this.task.get('pomodoros')[i].date; 
    if(_this.isInRange())
      this.taskTime += 60 * this.taskDuration;
  };
}

PomodoroStatistics.prototype.abortIfPomodorosEmpty = function(){
  if(!this.task.get('pomodoros').length)
    return true;
  return false;
}

PomodoroStatistics.prototype.createTaskObj = function(){
  this.name = this.task.get("name").substring(0, 5);
  this.jsonStatistics.label.push(this.task.get("name"));
  this.taskObj = { 'label': this.task.get("name"), 'values':[]};
};

PomodoroStatistics.prototype.includeTaskObjInJsonStats = function(){
  this.totalTime += parseInt(this.taskTime);
  this.taskObj.values.push(this.taskTime);
  this.jsonStatistics.values.pushObject(this.taskObj);
}

PomodoroStatistics.prototype.isInRange = function(){
  var taskArray = this.pomodoroDate.split('|')[0].split('/'),
      taskDate = new Date(taskArray[2],(taskArray[1] - 1), taskArray[0]);
  if(taskDate >= this.lastDate){
    return true
  }else{
    return false
  }
};

PomodoroStatistics.prototype.setPeriod = function(){
  this.date = new Date(), this.lastDate = new Date();
  this.lastDate.setDate(this.lastDate.getDate() - this.period); 
  var startPeriod = this.lastDate.getDate()+"/"+(this.lastDate.getMonth()+1)+"/"+this.lastDate.getFullYear(),
    endPeriod = this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear();
  $('#selected-period').html("<h6>period:"+startPeriod+" "+endPeriod+"</h6>");
};

PomodoroStatistics.prototype.includeTaskTime = function(time, name){
  $('#total-time-tasks').append('<p>'+name+": "
                                +time.toHHMMSS()+'</p>');

}

