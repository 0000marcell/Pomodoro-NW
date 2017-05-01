App.EditRoute = Ember.Route.extend({
  model(params) {
    return store.task.findBy('id', params.task_id);
  }
});
