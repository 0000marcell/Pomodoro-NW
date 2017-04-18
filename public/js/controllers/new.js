App.NewController = Ember.ObjectController.extend({
  actions: {
    save(model) {
      if(!model.name){
        console.log('the name of the task cant be blank');
        return;
      }
      model.creation_date = new Date();
      model.id = 
        parseInt(this.store.all('task').content.slice(-1)[0].id) + 1;
      this.store.createRecord('task', model);
      let obj = 
        utils.transformTaskObject(this.store.all('task').content);
      obj.tasks.push(model);
      obj.lastUpdate = new Date();
      let content = JSON.stringify(obj);
      if(awsUseStorage){
        fileIO.uploadAWS(content);
      }
      fileIO.save(content,
        mainDataPath)
      this.transitionToRoute('main');
    },
    cancel() {
      this.transitionToRoute('main');
    }
  }
});

