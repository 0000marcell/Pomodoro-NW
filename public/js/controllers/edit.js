App.EditController = Ember.ObjectController.extend({
  actions: {
    save(task) {
      if(!task.get('name')){
        console.log('the name of the task cant be blank');
        return;
      }
      fileIO.saveTasks(this.store.all('task'));
      this.transitionToRoute('main');
    },
    delete(task) {
      this.store.unloadRecord(task);
      fileIO.saveTasks(this.store.all('task'));
      this.transitionToRoute('main');
    }
  }
});
