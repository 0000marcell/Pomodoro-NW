App.EditController = Ember.ObjectController.extend({
  actions: {
    save(task) {
      if(!task.get('name')){
        console.log('the name of the task cant be blank');
        return;
      }
      task.save();
      task.saveOnFile();
      this.transitionTo('main');
    },
    delete(task) {
      task.destroyRecord().then(() => {
        task.saveOnFile();
        this.transitionTo('main');
      });
    }
  }
});
