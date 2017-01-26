/*
 Main funtion is createJsonStatistics
 pomodoro model 
 tasks: [{id: 0, name: 
  editing, 
  creation_data: "27/12/2016|21|9|38", 
  last_active: "09/11/2015|17|49|2",
  duration: "25:00",
  pomodoros: [{date:"23/02/2015|16|2|57"}]}]

  methods:
  init sets this.tasks object
  loadStatistics, empties #total-time-tasks, runs createJsonStatistics
  loadD3Calendar, creates the d3 calendar
  D3includeDate, ?
  createJsonStatistics, loop throught every tasks calculating 
                        the jsonStatistics to be show on the jit graphic
  calculateTasksPercentage, calculate the tasks percentage
  createTaskObj, create the taskObject and jsonStatistics object used in the jit graphic and the 
                 list of tasks 
  includeTaskTime, includes the total taskTime on the view
  getTask, returns a task based on the id
  filterPomodoros, return all tasks with pomodoros filtered in a date range
  transformDate, transform date string
  mostProductiveMonth, returns the most productive month
  mostProductiveDay, 
  firstPomodoro, gets the first pomodoro ever made 
  lastDayMonth, gets the last day of the month
  getPomodorosDateRange, get all pomodoros from a task in a specific date range
  flatPomodoros, returns a array with only the pomodoros of the tasks
*/
function PomodoroStatistics(){
}

/**
 * initialize the tasks property
 * @method init
 * @param {Object} tasks
*/
PomodoroStatistics.prototype.init = function(tasks){
  this.tasks = tasks;
  return this;
}

/**
 * load the jsonStatistics on the bar chart, obj format is:
 * var json = {  'label': ['label A', 'label B', 'label C', 'label D'],  
 *         'values': [{'label': 'date A','values': [20]}}
 * @method loadStatistics
 */
PomodoroStatistics.prototype.loadBarChart = function(){
  $('#total-time-tasks').empty(); 
  $('#infovis').empty();
  this.filterPomodoros()
      .createJsonStatistics()
      .calculateCanvasSize()
      .calculateTasksPercentage();
  init(this.jsonStatistics);
  return this;
}

/**
 * create a D3 calendar
 * @method loadD3Calendar
 * @param {object} tasks
 */
PomodoroStatistics.prototype.loadD3Calendar = function(){
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
  this.D3datesJSON = [];
  this.tasks.forEach((task) => {
    for(var i = 0; i < task.pomodoros.length; i++){
      this.D3JSON = {"Date": "", "Pomodoros": 1};
      this.D3JSON.Date = transformDateToString(task.pomodoros[i]);
      (!this.D3datesJSON.length) ? this.D3datesJSON.push(this.D3JSON) :
                           this.D3includeDate();
    }
  });

  d3.json("data.json", (error, json) => {
    json = this.D3datesJSON;
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

/**
 * ?
 * @method D3includeDate
 */
PomodoroStatistics.prototype.D3includeDate = function(){
  var found = 0;
  for (var i = 0; i < this.D3datesJSON.length; i++) {
    if(this.D3JSON.Date == this.D3datesJSON[i].Date){
      this.D3datesJSON[i].Pomodoros++;
      found = 1;
      break;
    } 
  }
  if(!found)
    this.D3datesJSON.push(this.D3JSON);
}

/**
 Loop through every task calculating all the statistics
 @method createJsonStatistics
 @param tasks
*/
PomodoroStatistics.prototype.createJsonStatistics = function(){
  this.jsonStatistics = this.tasks.reduce((obj, task) => {
    if(!task.pomodoros.length)
      return obj;
    let totalTime = this.calculateTaskTotalTime(task);
    obj.label.push(task.name);
    obj.values
      .push({ label: task.name, values: [totalTime] });
    this.includeTaskTime(totalTime, task.name);
    return obj;
  }, { label: [], values: [] });
  return this;
  let tasksTotalTime = this.jsonStatistics.values.reduce((prev, next) => {
    return prev + next.values[0];
  }, 0);
  this.includeTaskTime(tasksTotalTime, 'Total');
  jsonStatistics.values = this.calculateTasksPercentage(jsonStatistics, tasksTotalTime);
  return jsonStatistics;
};

/**
 * @method calculateTaskTotalTime
 * @param {Object} tasks
 * @return {Number} total time 
*/
PomodoroStatistics.prototype.calculateTaskTotalTime = function(tasks){
  return Math.floor((tasks.pomodoros.length * 30)/ 60);
}

/**
 * Go through each task on the jsonStatistics object
 * and calculate the percentage
 * pushes the result to jsonStatistics.values array
 * @method calculateTasksPercentage
 */
PomodoroStatistics.prototype.calculateTasksPercentage = function(){
  let totalTime = this.jsonStatistics.values.reduce((prev, next) => {
    return prev + next.values[0];
  }, 0);
  this.includeTaskTime(totalTime, 'Total');
  this.jsonStatistics.values = this.jsonStatistics.values.reduce((arr, item) => {
    let taskTotalTime = item.values[0],
        percentage = Math.floor(100/(totalTime/taskTotalTime));
    arr.push({label: item.label, values: [percentage]});
    return arr;
  }, []);  
  return this;
}

/**
 * includes the total time on the jsonStatistics
 * @method includeTotalTimeObj
PomodoroStatistics.prototype.includeTotalTimeObj = function(){
  var taskObj = { 'label': 'Total', 'values':[this.totalTime]};
  this.jsonStatistics.values.pushObject(taskObj);
}
*/

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
PomodoroStatistics.prototype.includeTaskObjInJsonStats = function(){
  this.totalTime += parseInt(this.taskTime);
  this.taskObj.values.push(this.taskTime);
  this.jsonStatistics.values.pushObject(this.taskObj);
}
*/

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
PomodoroStatistics.prototype.includeTaskTime = function(time, taskName){
  $('#total-time-tasks')
    .append(`<p>${taskName}: ${time}h</p>`)
}


/**
 * returns a task based on the id
 * @method getTask
 * @param {String} taskId
 * @param {Object} tasks
 * @returns {obj} 
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
 * @method filterPomodoros
 * @param {String} startDate (e.g: '27/12/2016')
 * @param {String} endDate (e.g: '01/10/2017')
 * @param {Array} tasks array of task objects
 * @return {Array} array with the tasks and the filtered pomodoros
*/
PomodoroStatistics.prototype.filterPomodoros = function(startDate, endDate){
  if(startDate){
    startDate = new Date(transformDate(startDate));
    endDate = new Date(transformDate(endDate));
  }else{
    startDate = new Date(transformDate(`01/01/${this.firstPomodoro(this.tasks)}`));
    endDate = new Date();
  }
  let result = [];
  this.tasks.forEach((task) => {
    result.push(this.getPomodorosDateRange(startDate, endDate, task));
  }); 
  this.tasks = result;
  return this;
}

/**
 * transform date string
 * "27/01/2015" > "01/27/2015" 
 * @function transformDate
 */
function transformDate(date){
  //"27/01/2015" > "01/27/2015" 
  var oldDate = date.split('/');
  var newDate = [oldDate[1], oldDate[0], oldDate[2]].join('/');
  return newDate;
}

/**
 * transform date object in an string format:
 * '27/01/2017'
 * @method transformDateToString
 * @param {Object} Date object
 * @returns {String}
 */
function transformDateToString(date){
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();
  return [(dd > 9 ? '' : '0') + dd,
          (mm > 9 ? '' : '0') + mm,
          date.getFullYear()].join('/');
}



/**
 * @method mostProductiveMonth 
 * @param {Object} tasks
 * @param {String} year
 * @returns {Object} 
 * {month: 'January', hours: '216 hours'}
*/
PomodoroStatistics.prototype.mostProductiveMonth = function(year){
  var pomodoros = this.flatPomodoros(this.filterPomodoros(`01/01/${year}`, `31/12/${year}`)),
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

/**
 * @method MostProductiveDay
 * @param {Object} tasks
 * @param {String} year
 * @returns {Object} 
 * Returns the most productive day in the format
 * {day: DateObject, hours: "12 hours"}
*/
PomodoroStatistics.prototype.mostProductiveDay = function(year){
  var pomodoros = this.flatPomodoros(this.filterPomodoros(`01/01/${year}`, `31/12/${year}`)),
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

/**
 * get the year of the first pomodoro ever made
 * @method firstPomodoro
 * @param tasks
 * @returns {Stirng} date.fullYear()
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

/**
 * gets the last day of the month
 * @method lastDayMonth 
 * @param {String} month
 * @param {String} year
 */
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
 * returns a rray with only the pomodoros of the tasks
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

/**
 * Calculate the width of the bar chart canvas
* @method calculateCanvasSize
*/
PomodoroStatistics.prototype.calculateCanvasSize = function(){
  let graphicSizeH = this.jsonStatistics.values.length * 86;
  $('#infovis').css('width', graphicSizeH);
  $('#center-container').css('width', graphicSizeH);
  return this;
}
