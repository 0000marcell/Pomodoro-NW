module('Unit: Controller : Main');

test('#filterMainModel', function(assert){
  let tasks = createTasks(10, 10),
      controller = 
      App.__container__.lookup("controller:main");
  controller.set('model', tasks);
  controller.set('activeState', {label: 'active', val: true});
  controller.filterModel();
  assert.equal(controller.get('filteredModel.length'), 5);
});
