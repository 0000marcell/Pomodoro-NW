App.EditRoute = Ember.Route.extend({
  model(params) {
    return this.store.find('task', params.task_id);
  }
});
