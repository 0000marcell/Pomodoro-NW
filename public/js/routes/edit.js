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
      if(!task.get('name')){
        console.log('the name of the task cant be blank');
        return;
      }
      task.validate().then(() => {
        task.save();
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
        this.transitionTo('main');
      });
    }
  }
});
