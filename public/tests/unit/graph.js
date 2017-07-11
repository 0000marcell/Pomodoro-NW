module('Unit: Graph');

test('#calculateCanvasSize', function(assert){
  let jsonStatistics = statistics
      .createJsonStatistics(createTasks(10, 10));
  let result = graph.calculateCanvasSize(jsonStatistics);
  assert.equal(result, 1200);
});

test('#d3CreateDates', function(assert){
  let tasks = createTasks(10, 10),
      result = graph.d3CreateDates(tasks);
  assert.equal(result.length, 10);
  assert.equal(result[0].Pomodoros, 10);
});

test('d3includeDate#', function(assert){
  let json = {"Date": new Date(), "Pomodoros": 1},
      arr = [json];
  graph.d3includeDate(arr, json); 
  graph.d3includeDate(arr, json);
  assert.equal(arr[0].Pomodoros, 3);
});
