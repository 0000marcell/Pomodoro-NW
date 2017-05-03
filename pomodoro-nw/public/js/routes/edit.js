App.EditRoute = Ember.Route.extend({
  model(params) {
    return store.tasks.findBy('id', params.task_id);
  }
});
