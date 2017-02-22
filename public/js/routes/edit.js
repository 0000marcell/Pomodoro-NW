App.EditRoute = Ember.Route.extend({
  model(params) {
    return this.store.find('task', params.task_id);
  },
  deactivate() {
    let model = this.modelFor('tasks.edit');
    if (model && model.get('isDirty') && !model.get('isSaving')) {
      model.rollback();
    }
  },
  actions: {
    save(task) {
      task.validate().then(() => {
        task.save();
        task.set('creation_date', 
                  new Date().getDateString());
        task.saveOnFile();
        this.transitionTo('main');
      });
    },
    cancel(task) {
      task.rollback();
      this.transitionTo('index');
    },
    delete(task) {
      task.destroyRecord().then(() => {
        task.saveOnFile();
        this.transitionTo('index');
      });
    }
  }
});
