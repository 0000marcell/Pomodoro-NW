function PomodoroStatistics(){
  this.date;
  this.lastDate;
  // this.newPomodoros = [];
}

PomodoroStatistics.prototype.getStatistics = function(tasks, period){
    var totalTime = 0, taskTime = 0,
      name, duration, date, 
      json = { 'label': ['Total'],
                'values': []
            };
  $('#total-time-tasks').empty(); 
  this.date = new Date(), this.lastDate = new Date();
  this.lastDate.setDate(this.lastDate.getDate() - period); 
  this.setPeriod();
  _this = this;
  tasks.forEach(function(task){
    name = task.get("name");
    duration = parseInt(task.get('duration')); 
    taskTime = 0;
    json.label.push(task.get("name"));
    var taskObj = { 'label': task.get("name"), 'values':[]};
    // console.log("pomodoro length "+task.get('pomodoros').length);
    if(!task.get('pomodoros').length)
      return;
    // _this.newPomodoros = []; 
    for(var i = 0; i < task.get('pomodoros').length; i++){
      date = task.get('pomodoros')[i].date; 
      // _this.swapDate(date, task, i);
      if(_this.isInRange(date, task))
        taskTime += 60 * duration;
    };
    // task.set('pomodoros', _this.newPomodoros); 
    _this.setTaskTime(taskTime.toString(), name);
    totalTime += parseInt(taskTime);
    taskObj.values.push(taskTime);
    json.values.pushObject(taskObj);
  }); 
  // console.log("totalTime "+totalTime+" taskTime "+taskTime);
  _this.setTaskTime(totalTime.toString(), 'Total');
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
    var percentage = Math.round(100/(totalTime/taskTime));
    if(!percentage)
      percentage = 0
    json.values[i].values.push(percentage);
  };
  $('#infovis').empty();
  // console.log("final json "+JSON.stringify(json));
  init(json);
};

PomodoroStatistics.prototype.isInRange = function(date){
  var taskArray = date.split('|')[0].split('/'),
      taskDate = new Date(taskArray[2],(taskArray[1] - 1), taskArray[0]);
  if(taskDate >= this.lastDate){
    return true
  }else{
    return false
  }
};

// PomodoroStatistics.prototype.swapDate = function(date, task, i){
//   var hours = date.split('|');
//   var taskArray = date.split('|')[0].split('/'), 
//       newDate = taskArray[1]+"/"+taskArray[0]+"/"+taskArray[2]+
//       "|"+hours[1]+"|"+hours[2]+"|"+hours[3]; 
//   console.log("new date: "+newDate);
//   var dateObject = {date: newDate};
//   this.newPomodoros.push(dateObject);
// };


PomodoroStatistics.prototype.setPeriod = function(){
  var startPeriod = this.lastDate.getDate()+"/"+(this.lastDate.getMonth()+1)+"/"+this.lastDate.getFullYear(),
    endPeriod = this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear();
  $('#selected-period').html("<h6>period:"+startPeriod+" "+endPeriod+"</h6>");
};

PomodoroStatistics.prototype.setTaskTime = function(time, name){
  $('#total-time-tasks').append('<p>'+name+": "+time.toHHMMSS()+'</p>');
}

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}



