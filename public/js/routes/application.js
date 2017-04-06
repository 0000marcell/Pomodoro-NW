App.ApplicationRoute = Ember.Route.extend({
  beforeModel(){
    if(environment === 'test'){
      let tasks = JSON.parse(JSON.stringify(tasksDate(1, 1)));
      tasks.forEach((task) => {
        task.pomodoros = task.pomodoros.map((pomodoro) => {
          return {date: new Date(pomodoro.date)}; 
        });
        this.store.push('task', task); 
      });
    }else{
      if(awsUseStorage){
        bucket.getObject({Key: 'data.json'}, (error, data) => {
          if (error) {
            alert("File sync failed : "+error);
          } else {
            let obj = JSON.parse(data.Body.toString());
            this.loadTasks(obj);
          }
        });
      }else{
        let obj = fileIO.read(mainDataPath);
        this.loadTasks(obj);
      }
    }
  },
  model() {
    return this.store.all('task');
  },
  afterModel(){
    this.transitionTo('main');
  },
  loadTasks(obj){
    obj.tasks.forEach((task) => {
      task.pomodoros = task.pomodoros.map((pomodoro) => {
        return {date: new Date(pomodoro.date)}; 
      });
      this.store.push('task', task);
    });
  }
});
