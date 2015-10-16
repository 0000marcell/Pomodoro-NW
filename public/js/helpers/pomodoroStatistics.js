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

PomodoroStatistics.prototype.loadD3Calendar = function(){
  console.log("running load calendar ");
  var width = 960,
      height = 136,
      cellSize = 17;

  var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

  var color = d3.scale.quantize()
    .domain([0, 5])
    .range(d3.range(6).map(function(d) {
                                          return "q" + d + "-5"; }));

  var svg = d3.select(".graph").selectAll("svg")
    .data(d3.range(2014, 2015))
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

  d3.csv("test.csv", function(error, csv) {
    if (error) throw error;

    var data = d3.nest()
      .key(function(d) { return d.Date; })
      .rollup(function(d) {
                            return d[0].Pomodoros;  })
      .map(csv);

    rect.filter(function(d) { return d in data; })
        .attr("class", function(d) {  
                                      console.log("returned color gonna be "+color(data[d]));
                                      return "day " + color(data[d]); })
        .select("title")
        .text(function(d) { return d + ": " + percent(data[d]); });
    rect.on('click', function(d){ alert(percent(data[d]))});
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

