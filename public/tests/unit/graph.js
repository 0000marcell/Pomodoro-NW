module('Unit: Graph');

test('#calculateCanvasSize', function(assert){
  let jsonStatistics = statistics
      .createJsonStatistics(createTasks(10, 10));
  let result = graph.calculateCanvasSize(jsonStatistics);
  assert.equal(result, 860);
});

test('#d3CreateDates', function(assert){
  let tasks = createTasks(10, 10),
      result = graph.d3CreateDates(tasks);
  debugger;
});
