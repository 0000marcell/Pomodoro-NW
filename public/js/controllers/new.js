App.NewController = Ember.ObjectController.extend({
  actions: {
    save(model) {
      if(!model.name){
        console.log('the name of the task cant be blank');
        return;
      }
      let task = this.store.createRecord('task', model);
      task.save();
      task.set('creation_date', 
                utils.getDateString(new Date()));
      task.saveOnFile(task);
      this.transitionTo('main');
    },
    cancel() {
      this.transitionTo('main');
    }
  }
});

