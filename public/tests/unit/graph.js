module('Unit: Graph');

test('#calculateCanvasSize', function(assert){
  let jsonStatistics = statistics
      .createJsonStatistics(createTasks(10, 10));
  let result = graph.calculateCanvasSize(jsonStatistics);
  assert.equal(result, 860);
});
