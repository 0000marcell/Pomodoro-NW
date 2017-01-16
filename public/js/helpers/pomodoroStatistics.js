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

/**
 * runs initialize, sets this.period to the param period
 * empty $('#total-time-tasks')
 * @method getStatistics
 * @param {object} tasks, array with all the tasks
 * @param {String} period, number of days for the period 
 */
PomodoroStatistics.prototype.getStatistics = function(tasks){
  $('#total-time-tasks').empty(); 
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

/**
 Loop through every task calculating all the statistics
 @method createJsonStatistics
 @param tasks
*/
PomodoroStatistics.prototype.createJsonStatistics = function(tasks){
  let jsonStatistics = { label: [], values: []};
  tasks.forEach((task) => {
    if(!task.pomodoros.length)
      return;
    jsonStatistics.label.push(task.name);
    jsonStatistics.values.push({label: task.name, values: []});
    this.includeTaskTime(this.taskTime.toString(),
                          this.name);
    this.includeTaskObjInJsonStats();
  }); 
  this.includeTaskTime(this.totalTime.toString(), 
                        'Total');
  this.includeTotalTimeObj();
  this.calculateTasksPercentage();
  this.loadStatistics();
};

/**
 * load the jsonStatistics obj the format is:
 * var json = {  'label': ['label A', 'label B', 'label C', 'label D'],  
 *         'values': [{'label': 'date A','values': [20]}}
 * @method loadStatistics
 */
PomodoroStatistics.prototype.loadStatistics = function(){
  $('#infovis').empty();
  init(this.jsonStatistics);
}

/**
 *
 * go through each task on the jsonStatistics object
 * and calculate the percentage
 * pushes the result to jsonStatistics.values array
 * @method calculateTasksPercentage
 */
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

/**
 * includes the total time on the jsonStatistics
 * @method includeTotalTimeObj
*/
PomodoroStatistics.prototype.includeTotalTimeObj = function(){
  var taskObj = { 'label': 'Total', 'values':[this.totalTime]};
  this.jsonStatistics.values.pushObject(taskObj);
}

/**
 * gets the task duration and sets to taskDuration
 * sets taskTime duration in hours
 * @method getTaskTotalTime
PomodoroStatistics.prototype.getTaskTotalTime = function(task){
  this.taskDuration = parseInt(this.task.get('duration')); 
  this.taskTime = 0;
  for(var i = 0; i < this.task.get('pomodoros').length; i++){
    this.pomodoroDate = this.task.get('pomodoros')[i].date; 
    if(_this.isInRange())
      this.taskTime += 60 * this.taskDuration;
  };
}
*/

/**
 * create the taskobject used 
 * @method createTaskObj
 */
PomodoroStatistics.prototype.createTaskObj = function(task){
  this.jsonStatistics.label.push(this.task.get("name"));
  this.taskObj = { 'label': this.task.get("name"), 'values':[]};
};

/**
 * includes the task time on the taskObj and
 * the taskObj on the jsonStatistics
 * @method includeTaskObjInJsonStats
 */
PomodoroStatistics.prototype.includeTaskObjInJsonStats = function(){
  this.totalTime += parseInt(this.taskTime);
  this.taskObj.values.push(this.taskTime);
  this.jsonStatistics.values.pushObject(this.taskObj);
}

/**
 * get the date from the pomodoro
 * converts it in to a date object verify if 
 * the taskDate is greation than the lastDate(filtered date)
 * and returns true or false
 * @method isInRange
PomodoroStatistics.prototype.isInRange = function(){
  var taskArray = this.pomodoroDate.split('|')[0].split('/'),
      taskDate = new Date(taskArray[2],(taskArray[1] - 1), taskArray[0]);
  if(taskDate >= this.lastDate){
    return true
  }else{
    return false
  }
};
*/

/**
 * Include the total task time on the view
 * @method includeTaskTime
 * @param {String} time, total time of the task 
 * @param {String} name, name of the task
*/
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

/**
 * Return all pomodoros on a given period in the format
 * the creation_date and last_active are strings, pomodoros are
 * date objects
 * [{id: 'id', name: 'name', creation_date: 'creation_date', 
 * last_active: 'last_active', duration: '25:00', pomodoros: []}];
 * @method getPomodoros
 * @param {String} startDate (e.g: '27/12/2016')
 * @param {String} endDate (e.g: '01/10/2017')
 * @param {Array} tasks array of task objects
 * @return {Array} array with the tasks and the filtered pomodoros
*/
PomodoroStatistics.prototype.getPomodoros = function(startDate, endDate, tasks){
  var selectedPomodoros = [];
  var startDate = new Date(transformDate(startDate));
  var endDate = new Date(transformDate(endDate));
  var result = [];
  tasks.forEach((task) => {
    result.push(this.getPomodorosDateRange(startDate, endDate, task));
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
  var pomodoros = this.flatPomodoros(this.getPomodoros(`01/01/${year}`, `31/12/${year}`, tasks)),
      monthsPomodoros = [],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (var i = 1; i <= 12; i++) {
    var start = new Date(year, i-1, 1);
    var end = new Date(year, i, 0); // last day of the month
    var result = [];
    for(var pomodoro of pomodoros){
      if(pomodoro >= start && pomodoro <= end){
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
  var pomodoros = this.flatPomodoros(this.getPomodoros(`01/01/${year}`, `31/12/${year}`, tasks)),
      days = [],
      startDate = new Date(transformDate(`01/01/${year}`))
      endDate = new Date(transformDate(`31/12/${year}`)),
      result = [];
  for (var iDate = new Date(startDate); iDate < endDate; iDate.setDate(iDate.getDate() + 1)) {
    result = [];
    for(var pomodoro of pomodoros){
      if(pomodoro.getTime() === iDate.getTime()){
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
  return {day: bigger[0].toDateString(), hours: `${(bigger.length/2)} hours`};
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

/**
 * Get all pomodoros from a task in a specific date range
 * @method getPomodorosDateRange
 * @param {Date Object} startDate
 * @param {Date Object} endDate
 * @param {Task Object} task
 * @return {Task Object} returns a task object with only the pomodoros on the range, 
 * the pomodoro dates are also converted to js date objects
*/
PomodoroStatistics.prototype.getPomodorosDateRange = function(startDate, endDate, task){
  let pomodoroDate;
  let resultTask = {id: task.get('id'), 
    name: task.get('name'),
    creation_date: task.get('creation_date'), 
    last_active: task.get('last_active'),
    duration: "25:00",
    pomodoros: []};
  task.get('pomodoros').forEach((pomodoro, index) => {
    pomodoroDate = pomodoro.date.split('|')[0];
    pomodoroDate = new Date(transformDate(pomodoroDate));
    if(pomodoroDate <= startDate || pomodoroDate >= endDate){
    }else{
      resultTask.pomodoros.push(pomodoroDate);
    }
  });
  return resultTask;
}

/**
 * @method flatPomodoros
 * @param {array} tasks, array os tasks with object dates as pomodoros
 * @returns {array} return array of pomodoros of all the tasks
 */
PomodoroStatistics.prototype.flatPomodoros= function(tasks){
  let result = [];
  for(let __task of tasks){
    result = result.concat(__task.pomodoros); 
  }
  return result;
}
