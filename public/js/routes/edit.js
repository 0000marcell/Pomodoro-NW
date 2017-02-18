App.EditRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('task', params.task_id);
  },
  deactivate: function() {
    var model = this.modelFor('tasks.edit');
    if (model && model.get('isDirty') && !model.get('isSaving')) {
      model.rollback();
    }
  },
  actions: {
    save(task) {
      var _this = this;
      task.validate().then(function() {
        task.save();
        task.set('creation_date', 
                  new Date().getDateString());
        task.saveOnFile();
        _this.transitionTo('main');
      });
    },
    cancel: function(task) {
      task.rollback();
      this.transitionTo('index');
    },
    // Delete specified task.
    delete: function(task) {
      var _this = this;
      task.destroyRecord().then(function(){
       task.saveOnFile();
       _this.transitionTo('index');
      });
    }
  }
});
