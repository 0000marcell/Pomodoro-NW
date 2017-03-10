moduleForModel('task', 'Task Model');

test('cant load a model', function(assert){
  let task = this.subject({ name: 'Task 1'  });
  assert.ok(true);
});
