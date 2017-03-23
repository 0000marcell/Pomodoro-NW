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
*/
App.Statistics = Ember.Object.extend({
  tasksTotalTime: [],
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
    this.get('tasksTotalTime')
      .pushObject({taskName: taskName, totalTime: time});
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
    let biggest = {month: null, size: 0},
          months = ['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December']; 
    for (let i = 1; i <= 12; i++) {
      let tasksFilter = this.filterPomodoros(tasks, 
        `01/${i}/${year}`, `${new Date(year, i, 0).getDate()}/${i}/${year}`); 
      let total = 0;
      for(let task of tasksFilter){
        if(typeof(task.pomodoros.length) === 'number'){
          total += task.pomodoros.length 
        }
      }
      if(biggest.size < total){
        biggest = {month: months[i-1], size: total};
      }
    }
    return biggest;
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
  lastPomodoro(tasks){
    let lastPomodoro = new Date(1900, 2, 2), 
      pomodoros, date;
    tasks.forEach((task) => {
      for(let pomodoro of task.get('pomodoros')){
        date = new Date(utils.transformDate(pomodoro.date.split('|')[0]))         
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
  lastDayMonth(month, year){
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
   * returns a array of all the pomodoros done today
   * @method todayPomodoros
   * return {Array} array with the name of all the tasks and the amount of time
   * [{taskName: 'pomodoro-nw', time: 6}]
   */
  todayPomodoros(tasks){
    let date = utils.transformDateToString(new Date()),
        tasksFiltered = this.filterPomodoros(tasks, date, date),
        result = [], time = 0, total = 0;
    tasksFiltered.forEach((task) => {
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
  weekPomodoroH(tasks){
    let tasksFiltered = this.filterPomodoros(tasks, utils.transformDateToString(utils.getMonday(new Date())), 
                       utils.transformDateToString(utils.getSunday(new Date())));
    let result = [], time = 0, total = 0;
    tasksFiltered.forEach((task) => {
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
  pomAverage(tasks){
    // amount of days between two dates
    let result = 0, time = 0, total = 0, n = 0;
    tasks.forEach((task) => {
      if(task.pomodoros.length){
        time = task.pomodoros.length * 30/60;
        total += time;
      }
    });
    let oneDay = 24*60*60*1000,
        firstDate = this.firstPomodoro(tasks),
        secondDate = this.lastPomodoro(tasks),
        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    result = Math.round(total/diffDays);
    return result;
  }
});

const statistics = App.Statistics.create();
