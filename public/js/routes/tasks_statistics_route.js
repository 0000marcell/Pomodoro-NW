App.TasksStatisticsRoute = Ember.Route.extend({
  model(){
    return this.store.findAll('task');
  },
  setupController: function(controller, model) {
    console.log('controller model!');
    controller.set('model', model);
  }
});

