// used for the schedule
let daysOfTheWeek = [];
['monday', 'tuesday', 'wednesday', 
  'thrusday', 'friday', 'saturday', 'sunday'].forEach((item) => {
  daysOfTheWeek.push({day: item, tasks: []});
});

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
        let localObj = fileIO.read(mainDataPath),
            lLastUpdate = false;
        if(localObj.lastUpdate){
          lLastUpdate = new Date(localObj.lastUpdate);
        }
        bucket.getObject({Key: 'new.json'}, (error, data) => {
          if (error) {
            alert("File sync failed : "+error);
          } else {
            let obj = JSON.parse(data.Body.toString()),
                rLastUpdate = new Date(obj.lastUpdate),
                result;
            if(lLastUpdate && rLastUpdate){
              if(lLastUpdate > rLastUpdate){
                result = localObj; 
              }else{
                result = obj;
              }
            }else{
              result = obj;
            }
            this.loadTasks(result);
            this.loadSchedule(result);
          }
        });
      }else{
        let obj = fileIO.read(mainDataPath);
        this.loadTasks(obj);
        this.loadSchedule(obj);
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
  },
  loadSchedule(obj){
    if(obj['schedule']){
      let color;
      daysOfTheWeek = [];
      let taskObj, tasks;
      obj.schedule.forEach((day) => {
        tasks = [];
        day.tasks.forEach((task, index) => {
          color = this.store.all('task')
            .findBy('id', task.id).get('color');
          color = (color) ? color : '#33C3F0';
          taskObj = TaskObj.create({itemId: index + 1, id: task.id, 
              name: task.name, amount: task.amount, color: color});   
          tasks.push(taskObj); 
        });
        daysOfTheWeek.push({day: day.day, tasks: tasks});
      });  
    }
  }
});
