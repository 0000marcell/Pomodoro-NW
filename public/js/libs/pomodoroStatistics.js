function PomodoroStatistics(){
  this.date = new Date();
}

PomodoroStatistics.prototype.getStatistics = function(tasks, period){
    var dd = this.date.getDate(), lastPeriod = dd-period, totalTime = 0,
      name, duration, date, 
      json = { 'label': ['Total'],
                'values': []
            };
  this.setPeriod(dd, lastPeriod);
  _this = this;
  tasks.forEach(function(task){
    name = task.get("name");
    duration = parseInt(task.get('duration')); 
    var taskTime = 0;
    json.label.push(task.get("name"));
    var taskObj = { 'label': task.get("name"), 'values':[]}; 
    for(var i = 0; i < task.get('pomodoros').length; i++){
      date = task.get('pomodoros')[i].date; 
      if(_this.isInRange(date, 'day', lastPeriod))
        taskTime += 60 * duration;
    };
    _this.setTaskTime(taskTime.toString(), name);
    totalTime += parseInt(taskTime);
    taskObj.values.push(taskTime);
    json.values.pushObject(taskObj);
  });
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
    json.values[i].values.push(percentage);
  };
  console.log("final json "+JSON.stringify(json));
  $('#infovis').html('');
  init(json);
};

PomodoroStatistics.prototype.isInRange = function(date, type, last){
 var day = this.getDateIn(date, 'day');
 if(day >= last){
  return true;
 }else{
  return false;
 }
};

PomodoroStatistics.prototype.getDateIn = function(date, type){
  var result = date.split('/');
  if(type == 'month'){
    return result[0];
  }
  if(type == 'day'){
    return result[1];
  }
};


PomodoroStatistics.prototype.setPeriod = function(dd, lastPeriod){
  var dd = this.date.getDate(), mm = this.date.getMonth()+1,
    yyyy = this.date.getFullYear(),
    startPeriod = lastPeriod+"/"+mm+"/"+yyyy,
    endPeriod = dd+"/"+mm+"/"+yyyy;
  $('#selected-period').html("<h6>period:"+startPeriod+" "+endPeriod+"</h6>");
};

PomodoroStatistics.prototype.setTaskTime = function(time, name){
  console.log("gonna append "+time.toHHMMSS());
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



