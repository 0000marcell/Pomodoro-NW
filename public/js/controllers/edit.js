App.EditController = Ember.ObjectController.extend({
  actions: {
    save(task) {
      if(!task.get('name')){
        console.log('the name of the task cant be blank');
        return;
      }
      fileIO
        .saveTasks(utils
        .transformTaskObject(this.store.all('task').content));
      this.transitionToRoute('main');
    },
    delete(task) {
      let result = this.store.all('task').content.filter((item) => {
        return item.id !== task.id;
      });
      let obj = utils.transformTaskObject(result);
      fileIO.saveTasks(obj);
      this.store.unloadAll('task');
      obj.tasks.forEach((item) => {
        this.store.push('task', item); 
      });
      this.transitionToRoute('main');
    },
    disable(task){
      task.set('disabled', true);
      fileIO
        .saveTasks(utils
        .transformTaskObject(this.store.all('task').content));
      this.transitionToRoute('main');
    }
  }
});
