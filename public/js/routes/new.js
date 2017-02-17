App.TasksNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('task'); 
  },
  isNew: true,
  renderTemplate: function(controller, model) {
    this.render('tasks.edit', {
      controller: controller
    });
  },

  // Roll back if the user transitions away by clicking a link, clicking the
  // browser's back button, or otherwise.
  deactivate: function() {
    var model = this.modelFor('tasks.new');
    if (model && model.get('isNew') && !model.get('isSaving')) {
      model.destroyRecord();
    }
  }
});

