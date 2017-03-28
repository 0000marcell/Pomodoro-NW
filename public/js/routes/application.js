App.ApplicationRoute = Ember.Route.extend({
  beforeModel(){
    if(environment === 'test'){
      let tasks = JSON.parse(JSON.stringify(tasksDate(10, 10)));
      tasks.forEach((task) => {
        this.store.push('task', task); 
      });
    }else{
      if(awsUseStorage){
        bucket.getObject({Key: 'data.json'}, (error, data) => {
          if (error) {
            alert("File sync failed : "+error);
          } else {
            let obj = JSON.parse(data.Body.toString());
            obj.tasks.forEach((task) => {
              this.store.push('task', task);       
            });
          }
        });
      }
    }
  },
  model() {
    return this.store.all('task');
  },
  afterModel(){
    this.transitionTo('main');
  }
});
