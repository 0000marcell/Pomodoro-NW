App.ApplicationRoute = Ember.Route.extend({
  model() {
    debugger;
    if(environment === 'test'){
      let tasks = createTasks(10, 10);
      this.store
          .pushPayLoad(JSON.parse(JSON.stringify(tasks)));
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
    this.store.push('tasks', {
        id: 1,
        title: "Fewer Moving Parts",
        artist: "David Bazan",
        songCount: 10
        
    });
    return this.store.findAll('task');
  },
  afterModel(){
    this.transitionTo('main');
  }
});
