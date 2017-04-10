App.NewController = Ember.ObjectController.extend({
  actions: {
    save(model) {
      if(!model.name){
        console.log('the name of the task cant be blank');
        return;
      }
      model.creation_date = new Date();
      model.id = this.store.all('task').content.length + 1;
      this.store.createRecord('task', model);
      let tasks = 
        this.store.all('task');
      tasks = tasks.toArray().map((task, index) => {
        let json = task.toJSON(); 
        json['id'] = index + 1;
        return json;
      });
      tasks.push(model);
      let content = `{"tasks": ${JSON.stringify(tasks)}}`;
      fileIO.uploadAWS(content);
      fileIO.save(`{"tasks": ${JSON.stringify(tasks)}}`,
        mainDataPath)
      this.transitionToRoute('main');
    },
    cancel() {
      this.transitionToRoute('main');
    }
  }
});

