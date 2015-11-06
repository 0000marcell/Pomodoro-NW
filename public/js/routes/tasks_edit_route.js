App.TasksEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('task', params.task_id);
  },
  // Roolll back if the user transitions away by clicking a link, clicking the
  // browser's back button, or otherwise.
  deactivate: function() {
    var model = this.modelFor('tasks.edit');
    if (model && model.get('isDirty') && !model.get('isSaving')) {
      model.rollback();
    }
  }
});