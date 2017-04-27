const TaskObj = Ember.Object.extend({
  data: null,
  width: 25,
  amount: '1',
  color: '#2196F3',
  style: function(){
    return `width: ${this.get('width') * this.get('amount')}px; 
      background-color: ${this.get('color')}; color: #fff;`;   
  }.property('amount') 
});

let daysOfTheWeek = [];
['monday', 'tuesday', 'wednesday', 
  'thrusday', 'friday', 'saturday', 'sunday'].forEach((item) => {
  daysOfTheWeek.push({day: item, tasks: []});
});

App.ScheduleController = Ember.ObjectController.extend({
  saveMessage: false,
  selectedDay: daysOfTheWeek[0],
  selectedTasks: daysOfTheWeek[0].tasks,
  daysOfTheWeek: daysOfTheWeek,
  changeDay: function() {
    this.set('selectedTasks', 
      this.get('selectedDay.tasks'));
  }.observes('selectedDay'),
  totalTime: function(){
    let total = 0;
    this.get('selectedDay.tasks').forEach((task) => {
      if(task.amount){
        total += parseInt(task.amount);
      } 
    });
    return total;
  }.property('selectedDay.tasks.@each.amount'),
  actions: {
    addTask(){
      //clone the object
      let selectedTask = this.get('selectedTask')._data,
          obj = TaskObj.create({data: {id: selectedTask.id, 
            name: selectedTask.name}});
      this.get('selectedDay.tasks').pushObject(obj);
    },
    removeTask(task){
      let arr = this.get('selectedTasks').filter((item) => {
        return item.data.id !== task.data.id;   
      });
      this.set('selectedTasks', arr);
      this.set('selectedDay.tasks', arr);
    },
    saveSchedule(){
      this.set('saveMessage', true);
      let data = this.get('daysOfTheWeek');
      fileIO.saveSchedule(data, this.store);
    }
  }
});
