App.TasksIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('task');
  }
});