var width = 460,
    height = 66,
    cellSize = 8;

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

App.Graph = Ember.Object.extend({
  /**
   * load the jsonStatistics on the bar chart, obj format is:
   * var json = {  'label': ['label A', 'label B', 'label C', 'label D'],  
   *         'values': [{'label': 'date A','values': [20]}}
   * @method loadStatistics
   */
  loadBarChart(tasks){
    $('#infovis').empty();
    let jsonStatistics = statistics.createJsonStatistics(tasks),
        canvasSize = this.calculateCanvasSize(jsonStatistics);
    $('#infovis').css('width', canvasSize);
    $('#center-container').css('width', canvasSize);
    init(statistics.calculateTasksPercentage(jsonStatistics));
  },
  /**
   * create a D3 calendar
   * @method loadD3Calendar
   * @param {object} tasks
   */
  loadD3Calendar(tasks){
    $('.graph').empty(); 

    var percent = d3.format(".1%"),
        format = d3.time.format("%d/%m/%Y");

    var color = d3.scale.quantize()
      .domain([0, 5])
      .range(d3.range(6).map(function(d) {
        return "q" + d + "-5"; 
      }));
    var svg = d3.select(".graph").selectAll("svg")
      .data(d3.range(statistics.firstPomodoro(tasks).getFullYear(), 
          parseInt(statistics.lastPomodoro(tasks).getFullYear()) + 1))
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
    
    d3.json("data.json", (error, json) => {
      json = this.d3CreateDates(tasks);
      if (error) throw error;

      var data = d3.nest()
        .key(function(d) { return d.Date; })
        .rollup(function(d) {
          return d[0].Pomodoros; }).map(json);
      rect.filter(function(d) { return d in data; })
          .attr("class", function(d) {  
            return "day " + color(data[d]); })
          .select("title")
          .text(function(d) { return d + ": " + percent(data[d]); });
      rect.on('click', function(d){ 
		    alert(data[d]);
			});
    });
    d3.select(self.frameElement).style("height", "2910px");
  },
  /**
   * Creates the object needed 
   * to load the dates in the calendar
   * @method d3
   * @param tasks {object}
   * @return obj
   */
  d3CreateDates(tasks){
    let d3datesJSON = [];
    tasks.forEach((task) => {
      for(var i = 0; i < task.pomodoros.length; i++){
        let d3JSON = {"Date": "", "Pomodoros": 1};
        debugger;
        d3JSON.Date = utils.transformDateToString(task.pomodoros[i].date);
        if(!d3datesJSON.length){
          d3datesJSON.push(d3JSON);
        }else{
          this.d3includeDate(d3datesJSON, d3JSON);
        }
      }
    });
    return d3datesJSON;
  },
  /**
   * raise the number os pomodoros
   * of a specific day if the dated
   * passed is already in the d3datesJSON object
   * if the date was not found, include the date 
   * in the d3datesJSON object
   * @method d3includeDate
   */
  d3includeDate(d3datesJSON, d3JSON){
    var found = 0;
    for (var i = 0; i < d3datesJSON.length; i++) {
      if(d3JSON.Date == d3datesJSON[i].Date){
        d3datesJSON[i].Pomodoros++;
        found = 1;
        break;
      } 
    }
    if(!found)
      d3datesJSON.push(d3JSON);
  },
  /**
  * Calculate the width of the bar chart canvas
  * @method calculateCanvasSize
  */
  calculateCanvasSize(jsonStatistics){
    let graphicSizeH = jsonStatistics.values.length * 86;
    return graphicSizeH;
  }
});

const graph = App.Graph.create();
