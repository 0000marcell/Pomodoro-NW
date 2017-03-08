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
  initialize(){
    this.filteredTasks = tasks;
    this.tasks = tasks;
    return this;
  },

  /**
   * load the jsonStatistics on the bar chart, obj format is:
   * var json = {  'label': ['label A', 'label B', 'label C', 'label D'],  
   *         'values': [{'label': 'date A','values': [20]}}
   * @method loadStatistics
   */
  loadBarChart(){
    $('#total-time-tasks').empty(); 
    $('#infovis').empty();
    this.createJsonStatistics()
        .calculateCanvasSize()
        .calculateTasksPercentage();
    init(this.jsonStatistics);
    return this;
  },
  /**
   * create a D3 calendar
   * @method loadD3Calendar
   * @param {object} tasks
   */
  loadD3Calendar(){
    $('.graph').empty(); 

    var width = 460,
        height = 66,
        cellSize = 8;

    var percent = d3.format(".1%"),
      format = d3.time.format("%d/%m/%Y");

    var color = d3.scale.quantize()
      .domain([0, 5])
      .range(d3.range(6).map(function(d) {
                                          return "q" + d + "-5"; }));

    var svg = d3.select(".graph").selectAll("svg")
      .data(d3.range(this.firstPomodoro().getFullYear(), 
          parseInt(this.lastPomodoro().getFullYear()) + 1))
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
    this.filteredTasks.forEach((task) => {
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
  },
  /**
   * ?
   * @method D3includeDate
   */
  D3includeDate(){
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
  },

  /**
   Loop through every task calculating all the statistics
   @method createJsonStatistics
   @param tasks
  */
  createJsonStatistics(){
    this.jsonStatistics = this.filteredTasks.reduce((obj, task) => {
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
  },

  /**
   * @method calculateTaskTotalTime
   * @param {Object} tasks
   * @return {Number} total time 
  */
  calculateTaskTotalTime(tasks){
    return Math.floor((tasks.pomodoros.length * 30)/ 60);
  },

  /**
   * Go through each task on the jsonStatistics object
   * and calculate the percentage
   * pushes the result to jsonStatistics.values array
   * @method calculateTasksPercentage
   */
  calculateTasksPercentage(){
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
  },
  /**
   * create the taskobject used 
   * @method createTaskObj
   */
  createTaskObj(){
    this.jsonStatistics.label.push(this.task.get("name"));
    this.taskObj = { 'label': this.task.get("name"), 'values':[]};
  },

  /**
   * Include the total task time on the view
   * @method includeTaskTime
   * @param {String} time, total time of the task 
   * @param {String} name, name of the task
  */
  includeTaskTime(){
    $('#total-time-tasks')
      .append(`<p>${taskName}: ${time}h</p>`)
  }
});
