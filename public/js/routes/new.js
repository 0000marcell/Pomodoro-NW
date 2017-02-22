App.NewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('task'); 
  },
  deactivate: function() {
    var model = this.modelFor('tasks.new');
    if (model && model.get('isNew') && !model.get('isSaving')) {
      model.destroyRecord();
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
        task.set('creation_date', 
                  new Date().getDateString());
        task.saveOnFile(task);
        this.transitionTo('main');
      });
    },
    cancel(task) {
      task.rollback();
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

