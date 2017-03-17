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
  firstPomodoro, get the first pomodoro made on the filteredTasks 
  lastPomodoro, get the last pomodoro made on the filteredTasks
  lastDayMonth, gets the last day of the month
  getPomodorosDateRange, get all pomodoros from a task in a specific date range
  flatPomodoros, returns a array with only the pomodoros of the tasks
*/
App.Statistics = Ember.Object.extend({

  /**
   * initialize the tasks property
   * @method init
   * @param {Object} tasks
  */
  init(tasks){
    this.filteredTasks = tasks;
    this.tasks = tasks;
    this.tasksTotalTime = [];
    return this;
  },
  
  /**
   Loop through every task calculating all the statistics
   @method createJsonStatistics
  */
  createJsonStatistics(tasks){
    let jsonStatistics = tasks.reduce((obj, task) => {
      if(!task.get('pomodoros').length)
        return obj;
      let totalTime = this.calculateTaskTotalTime(task);
      obj.label.push(task.get('name'));
      obj.values
        .push({ label: task.get('name'), values: [totalTime] });
      this.includeTaskTime(totalTime, task.get('name'));
      return obj;
    }, { label: [], values: [] });
    return jsonStatistics;
  },

  /**
   * @method calculateTaskTotalTime
   * @param {Object} tasks
   * @return {Number} total time 
  */
  calculateTaskTotalTime(tasks){
    return Math.floor((tasks.get('pomodoros').length * 30)/ 60);
  },

  /**
   *
   * Go through each task on the jsonStatistics object
   * and calculate the percentage
   * pushes the result to jsonStatistics.values array
   * @method calculateTasksPercentage
   */
  calculateTasksPercentage(jsonStatistics){
    let totalTime = jsonStatistics.values.reduce((prev, next) => {
      return prev + next.values[0];
    }, 0);
    this.includeTaskTime(totalTime, 'Total');
    jsonStatistics.values = jsonStatistics.values.reduce((arr, item) => {
      let taskTotalTime = item.values[0],
          percentage = Math.floor(100/(totalTime/taskTotalTime));
      arr.push({label: item.label, values: [percentage]});
      return arr;
    }, []);  
    return jsonStatistics;
  },

  /**
   * Include the total task time on the view
   * @method includeTaskTime
   * @param {String} time, total time of the task 
   * @param {String} name, name of the task
  */
  includeTaskTime(taskName, time){
    this.tasksTotalTime.push({taskName: taskName, totalTime: time});
    /*
    $('#total-time-tasks')
      .append(`<p>${taskName}: ${time}h</p>`)
    */
  },
  /**
   * filter tasks by id using a array
   * @method filterTasks 
   * @param {objcest task} tasks
   * @param {Array} array of ids
   * @returns {obj} 
  */
  filterTasks(tasks, arr){
    let result = [];
    for(let val of arr){
      result.push(tasks
          .filterBy('id', val)[0]);
    }
    return result;
  },
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
  filterPomodoros(tasks, startDate, endDate){
    if(startDate){
      startDate = new Date(utils.transformDate(startDate));
      endDate = new Date(utils.transformDate(endDate));
    }else{
      startDate = new Date(utils.transformDate(`01/01/${this.firstPomodoro().getFullYear()}`));
      endDate = new Date();
    }
    let result = [];
    tasks.forEach((task) => {
      result.push(this.getPomodorosDateRange(task, startDate, endDate));
    }); 
    return result;
  },
  /**
   * @method mostProductiveMonth 
   * @param {Object} tasks
   * @param {String} year
   * @returns {Object} 
   * {month: 'January', hours: '216 hours'}
  */
  mostProductiveMonth(tasks, year){
    let pomodoros = this.filterPomodoros(tasks, 
        `01/01/${year}`, `31/12/${year}`);
      monthsPomodoros = [],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
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
  },

  /**
   * @method MostProductiveDay
   * @param {Object} tasks
   * @param {String} year
   * @returns {Object} 
   * Returns the most productive day in the format
   * {day: DateObject, hours: "12 hours"}
  */
  mostProductiveDay(year){
    let pomodoros = this.resetFilter()
                      .filterPomodoros(`01/01/${year}`, `31/12/${year}`)
                      .flatPomodoros();
      days = [],
      startDate = new Date(utils.transformDate(`01/01/${year}`))
      endDate = new Date(utils.transformDate(`31/12/${year}`)),
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
    if(bigger.length){
      return {day: bigger[0].toDateString(), hours: `${(bigger.length/2)} hours`};
    }else{
      return {day: null, hours: null};
    }
  },

  /**
   * get the date first pomodoro ever made on the filteredTasks
   * @method firstPomodoro
   * @returns {Object} date
   * get the first pomodoro
  */
  firstPomodoro(tasks){
    let firstPomodoro = new Date(), 
      pomodoros, date;
    tasks.forEach(function(task){
      pomodoros = (task['get']) ? task.get('pomodoros') : 
                                                 task.pomodoros;
      for(let pomodoro of pomodoros){
        date = (task['get']) ? new Date(utils.transformDate(pomodoro.date.split('|')[0])) :
                               pomodoro;
        firstPomodoro = (date < firstPomodoro) ? date : firstPomodoro; 
      }
    });
    return firstPomodoro;
  },

  /**
  * get the last pomodoro made on the filteredTasks
  * @method lastPomodoro
  * @return {Object} returns the last pomodoro ever made
  */
  lastPomodoro(){
    let lastPomodoro = new Date(1900, 2, 2), 
      pomodoros, date;
    this.filteredTasks.forEach(function(task){
      pomodoros = (task['get']) ? task.get('pomodoros') : 
                                                 task.pomodoros;
      for(let pomodoro of pomodoros){
        date = (task['get']) ? new Date(utils.transformDate(pomodoro.date.split('|')[0])) :
                               pomodoro;
        lastPomodoro = (date > lastPomodoro) ? date : lastPomodoro; 
      }
    });
    return lastPomodoro;
  },

  /**
   * gets the last day of the month
   * @method lastDayMonth 
   * @param {String} month
   * @param {String} year
   */
  lastDayMonth(){
    return new Date(year, month, 0).getDate().toString();
  },

  /**
   * Get all pomodoros from a task in a specific date range
   * @method getPomodorosDateRange
   * @param {Date Object} startDate
   * @param {Date Object} endDate
   * @param {Task Object} task
   * @return {Task Object} returns a task object with only the pomodoros on the range, 
   * the pomodoro dates are also converted to js date objects
  */
  getPomodorosDateRange(task, startDate, endDate){
    let pomodoroDate;
    let resultTask = {id: task.get('id'), 
      name: task.get('name'),
      creation_date: task.get('creation_date'), 
      last_active: task.get('last_active'),
      duration: "25:00",
      pomodoros: []};
    task.get('pomodoros').forEach((pomodoro, index) => {
      pomodoroDate = pomodoro.date.split('|')[0];
      pomodoroDate = new Date(utils.transformDate(pomodoroDate));
      if(pomodoroDate >= startDate && pomodoroDate <= endDate){
        resultTask.pomodoros.push(pomodoroDate);
      }  
    });
    return resultTask; 
  },

  /**
   * returns a rray with only the pomodoros of the tasks
   * @method flatPomodoros
   * @param {array} tasks, array os tasks with object dates as pomodoros
   * @returns {array} return array of pomodoros of all the tasks
   */
  flatPomodoros(){
    let result = [];
    for(let __task of this.filteredTasks){
      result = result.concat(__task.pomodoros); 
    }
    return result;  
  },

  /**
  * Calculate the width of the bar chart canvas
  * @method calculateCanvasSize
  */
  calculateCanvasSize(){
    let graphicSizeH = this.jsonStatistics.values.length * 86;
    $('#infovis').css('width', graphicSizeH);
    $('#center-container').css('width', graphicSizeH);
    return this;
  },

  /**
   * reset the filteredTasks property
   * @method resetFilter
  */
  resetFilter(){
    this.filteredTasks = this.tasks;
    return this;
  },

  /**
   * returns a array of all the pomodoros done today
   * @method todayPomodoros
   * return {Array} array with the name of all the tasks and the amount of time
   * [{taskName: 'pomodoro-nw', time: 6}]
   */
  todayPomodoros(){
    let date = utils.transformDateToString(new Date());
    this.filterPomodoros(date, date);
    let result = [], time = 0, total = 0;
    this.filteredTasks.forEach((task) => {
      if(task.pomodoros.length){
        time = task.pomodoros.length * 30/60;
        total += time;
        result.pushObject({name: task.name, time: time})
      }
    });
    result.pushObject({name: 'total', time: total});
    return result;
  },

  /**
  * return the hours worked this week
  * @method weekPomodoroH
  * @return {String} total hours of the week so far
  */
  weekPomodoroH(){
    this.filterPomodoros(utils.transformDateToString(utils.getMonday(new Date())), 
                       utils.transformDateToString(utils.getSunday()));
    let result = [], time = 0, total = 0;
    this.filteredTasks.forEach((task) => {
      if(task.pomodoros.length){
        time = task.pomodoros.length * 30/60;
        total += time;
        result.pushObject({name: task.name, time: time})
      }
    });
    result.pushObject({name: 'total', time: total});
    return result;
  },
  /**
   * return the average of pomodoros a day
  * @method pomAverage
  * @return {String} total hours of the week so far
  */
  pomAverage(){
    // amount of days between two dates
    let result = 0, time = 0, total = 0, n = 0;
    this.filteredTasks.forEach((task) => {
      if(task.pomodoros.length){
        time = task.pomodoros.length * 30/60;
        total += time;
      }
    });
    let oneDay = 24*60*60*1000,
        firstDate = this.firstPomodoro(),
        secondDate = this.lastPomodoro(),
        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    result = Math.round(total/diffDays);
    return result;
  }
});

const statistics = App.Statistics.create();
