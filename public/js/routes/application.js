App.ApplicationRoute = Ember.Route.extend({
  beforeModel(){
    if(environment === 'test'){
      let tasks = JSON.parse(JSON.stringify(createTasks(10, 10)));
      tasks.forEach((task) => {
        this.store.push('task', task); 
      });
    }else{
      if(awsUseStorage){
        bucket.getObject({Key: 'data.json'}, (error, data) => {
          if (error) {
            alert("File sync failed : "+error);
          } else {
            this.store
              .pushPayLoad(JSON.parse(data.Body.toString()));
            //App.Task.FIXTURES = $.map(JSON.parse(attachment), 
                          //function(el) { return el; }); 
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
