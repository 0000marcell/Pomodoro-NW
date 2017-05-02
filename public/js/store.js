let schedule = [];
['monday', 'tuesday', 'wednesday', 
  'thrusday', 'friday', 'saturday', 'sunday'].forEach((item) => {
  schedule.push({day: item, tasks: []});
});
let tags = [{id: null, name: null, color: null}];

App.Store = Ember.Object.extend({
  tasks: [],
  schedule: schedule,
  tags: tags,
  save(){
    let obj = { tasks: this.tasks, 
                schedule: utils.transformScheduleObject(this.schedule),
                tags: this.tag,
                lastUpdate: new Date()};
    debugger;
    let content = JSON.stringify(obj);
    if(awsUseStorage){
      this.uploadAWS(content); 
    }
    fileIO.save(content, mainDataPath);
  },
  loadForTests(){
    let tasks = JSON.parse(JSON.stringify(tasksDate(1, 1)));
    tasks.forEach((task) => {
      task.pomodoros = task.pomodoros.map((pomodoro) => {
        return {date: new Date(pomodoro.date)}; 
      });
      this.tasks.push(task); 
    });
  },
  loadFromAWS(){
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
        this.load(result);
      }
    });
  },
  loadFromFile(){
    let localObj = fileIO.read(mainDataPath);
    this.load(localObj);
  },
  load(obj){
    obj.tasks.forEach((task) => {
      task.pomodoros = task.pomodoros.map((pomodoro) => {
        return {date: new Date(pomodoro.date)}; 
      });
      this.tasks.push(task);
    });
    if(!obj['schedule']){ return };
    this.schedule = [];
    let color;
    let taskObj, tasks;
    obj.schedule.forEach((day) => {
      tasks = [];
      day.tasks.forEach((task, index) => {
        color = store.tasks.findBy('id', task.id).color
        color = (color) ? color : '#33C3F0';
        taskObj = TaskObj.create({itemId: index + 1, id: task.id, 
            name: task.name, amount: task.amount, color: color});   
        tasks.push(taskObj); 
      });
      this.schedule.push({day: day.day, tasks: tasks});
    });  
  }
});

const store = App.Store.create({});
