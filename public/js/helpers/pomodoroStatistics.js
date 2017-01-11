/*
 Main funtion is createJsonStatistics
 pomodoro model 
 tasks: [{id: 0, name: 
  editing, 
  creation_data: "27/12/2016|21|9|38", 
  last_active: "09/11/2015|17|49|2",
  duration: "25:00",
  pomodoros: [{date:"23/02/2015|16|2|57"}]}]
*/
function PomodoroStatistics(){
}

PomodoroStatistics.prototype.initialize = function(){
  this.pomodoroDate, this.lastDate,
  this.jsonStatistics = { 'label': ['Total'],
                'values': []
            };
  this.totalTime = 0, this.taskDuration, this.taskName,
  this.taskObj, this.task, this.taskTime, this.period;
  this.D3datesJSON, this.d3Date;
}

PomodoroStatistics.prototype.getStatistics = function(tasks, period){
  this.initialize();
  this.period = period;
  $('#total-time-tasks').empty(); 
  this.setPeriod();
  this.createJsonStatistics(tasks);
};

PomodoroStatistics.prototype.loadD3Calendar = function(tasks){
  var width = 960,
      height = 136,
      cellSize = 17;

  var percent = d3.format(".1%"),
    format = d3.time.format("%d/%m/%Y");

  var color = d3.scale.quantize()
    .domain([0, 5])
    .range(d3.range(6).map(function(d) {
                                          return "q" + d + "-5"; }));

  var svg = d3.select(".graph").selectAll("svg")
    .data(d3.range(2015, 2018))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
    .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .datum(format);

  rect.append("title")
    .text(function(d) { return d; });

  svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);
  var _this = this;
  this.D3datesJSON = [];
  tasks.forEach(function(task){
    for(var i = 0; i < task.get('pomodoros').length; i++){
      _this.D3JSON = {"Date": "", "Pomodoros": 1};
      _this.D3JSON.Date = task.get('pomodoros')[i].date.split("|")[0];
      (!_this.D3datesJSON.length) ? _this.D3datesJSON.push(_this.D3JSON) :
                           _this.D3includeDate();
    }
  });

  d3.json("data.json", function(error, json) {
    json = _this.D3datesJSON;
    if (error) throw error;

    var data = d3.nest()
      .key(function(d) { return d.Date; })
      .rollup(function(d) {
                            return d[0].Pomodoros;  })
      .map(json);

    rect.filter(function(d) { return d in data; })
        .attr("class", function(d) {  
                                      return "day " + color(data[d]); })
        .select("title")
        .text(function(d) { return d + ": " + percent(data[d]); });
    rect.on('click', function(d){ 
												alert(data[d]);
										 });
  });

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
        d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }

  d3.select(self.frameElement).style("height", "2910px");  
};

PomodoroStatistics.prototype.D3includeDate = function(){
  var found = 0;
  for (var i = 0; i < _this.D3datesJSON.length; i++) {
    if(_this.D3JSON.Date == _this.D3datesJSON[i].Date){
      _this.D3datesJSON[i].Pomodoros++;
      found = 1;
      break;
    } 
  }
  if(!found)
    _this.D3datesJSON.push(_this.D3JSON);
}
/*
 Loop through every task calculating all the statistics
 task.get('pomodoros') 
*/
PomodoroStatistics.prototype.createJsonStatistics = function(tasks){
  _this = this;
  tasks.forEach(function(task){
    _this.task = task;
    if(_this.abortIfPomodorosEmpty())
      return;
    _this.getTaskTotalTime();
    if(typeof _this.taskTime === 'undefined' ||
       _this.taskTime.toString() == 0)
      return;
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

/*
 * Get pomodoros from a task in a specific date range
 * returns
 * [{taskName: 'editing', date: "27/12/2016, hour: "17:9:38"}]
*/
PomodoroStatistics.prototype.getTask = function(taskId, tasks){
  let result;
  tasks.forEach((task) => {
    if(task.get('id') === taskId){
      result = task;
    }
  });
  return result;
}

/*
 * Return all pomodoros on a given period in the format
 * [{taskName: 'editing', date: "27/12/2016, hour: "17:9:38"}]
 * date format: '27/12/2016'
*/
PomodoroStatistics.prototype.getPomodoros = function(startDate, endDate, tasks){
  var selectedPomodoros = [];
  var startDate = new Date(transformDate(startDate));
  var endDate = new Date(transformDate(endDate));
  var result = [];
  tasks.forEach((task) => {
    var date, hour, temp;
    for(var pomodoro of task.get('pomodoros')){
      var json = {taskName: task.get('name'), date: ""};
      temp = pomodoro.date.split('|'); 
      date = temp[0], hour = temp[1];
      date = new Date(transformDate(date));
      if(date >= startDate && date <= endDate){
        json.date = date;
        result.push(json);
      }
    }
  }); 
  return result;
}

function transformDate(date){
  "27/01/2015" > "01/27/2015" 
  var oldDate = date.split('/');
  var newDate = [oldDate[1], oldDate[0], oldDate[2]].join('/');
  return newDate;
}
/*
 * returns a object 
 * {month: 'January', hours: '216 hours'}
*/
PomodoroStatistics.prototype.mostProductiveMonth = function(tasks, year){
  var pomodoros = this.getPomodoros(`01/01/${year}`, `31/12/${year}`, tasks),
      monthsPomodoros = [],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (var i = 1; i <= 12; i++) {
    var start = new Date(year, i-1, 1);
    var end = new Date(year, i, 0); // last day of the month
    var result = [];
    for(var pomodoro of pomodoros){
      if(pomodoro.date >= start && pomodoro.date <= end){
        result.push(pomodoro);
      }
    }
    monthsPomodoros.push(result);
  }
  var bigger = [], biggerIndex = 0, i = 0;
  for(var month of monthsPomodoros){
    if(month.length > bigger.length){
      bigger = month;
      biggerIndex = i;
    }
    i++;
  }
  return {month: months[biggerIndex], hours: `${(bigger.length/2)} hours`};
}

/* 
 * Returns the most productive day in the format
 * {day: DateObject, hours: "12 hours"}
*/
PomodoroStatistics.prototype.mostProductiveDay = function(tasks, year){
  var pomodoros = this.getPomodoros(`01/01/${year}`, `31/12/${year}`, tasks),
      days = [],
      startDate = new Date(transformDate(`01/01/${year}`))
      endDate = new Date(transformDate(`31/12/${year}`)),
      result = [];
  for (var iDate = new Date(startDate); iDate < endDate; iDate.setDate(iDate.getDate() + 1)) {
    result = [];
    for(var pomodoro of pomodoros){
      if(pomodoro.date.getTime() === iDate.getTime()){
        result.push(pomodoro);
      }
    }
    days.push(result);
  }
  var bigger = [];
  for(var day of days){
    if(day.length > bigger.length){
      bigger = day;
    }
  }
  return {day: bigger[0].date.toDateString(), hours: `${(bigger.length/2)} hours`};
}

/* 
 * get the first pomodoro
*/
PomodoroStatistics.prototype.firstPomodoro = function(tasks){
  let firstPomodoro = new Date(),
      date, pomodoros;
  tasks.forEach(function(task){
    pomodoros = task.get('pomodoros');
    for(let pomodoro of pomodoros){
      date = new Date(transformDate(pomodoro.date.split('|')[0]));
      if(date < firstPomodoro){
        firstPomodoro = date; 
      }
    }
  });
  return firstPomodoro.getFullYear();
}

PomodoroStatistics.prototype.lastDayMonth= function(month, year){
  return new Date(year, month, 0).getDate().toString();
}

/*
 * Get all pomodoros from a task in a specific date range
*/
PomodoroStatistics.prototype.getPomodorosDateRange = function(startDate, endDate, task){
  debugger;
  task.get('pomodoros').forEach((pomodoro, index, task) => {
    let date = pomodoro.date.split('|')[0],
        date = new Date(transformDate(date));
    if(date <= startDate || date >= endDate){
      tasks.removeAt(index);
    }
  });
  return task;
}
