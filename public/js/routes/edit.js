App.EditRoute = Ember.Route.extend({
  model(params) {
    return this.store.find('task', params.task_id);
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
    delete(task) {
      task.destroyRecord().then(() => {
        task.saveOnFile();
        this.transitionTo('main');
      });
    }
  }
});
