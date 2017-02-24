App.NewRoute = Ember.Route.extend({
  model: function() {
    return {name: null}; 
  },
  actions: {
    save(model) {
      if(!model.name){
        console.log('the name of the task cant be blank');
        return;
      }
      let task = this.store.createRecord('task', model);
      task.validate().then(() => {
        task.save();
        task.set('creation_date', 
                  new Date().getDateString());
        task.saveOnFile(task);
        this.transitionTo('main');
      });
    },
    cancel() {
      this.transitionTo('main');
    }
  }
});

