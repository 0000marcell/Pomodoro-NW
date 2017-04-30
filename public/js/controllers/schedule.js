const TaskObj = Ember.Object.extend({
  id: null,
  name: null,
  width: 25,
  amount: '1',
  color: '#2196F3',
  style: function(){
    return `width: ${this.get('width') * this.get('amount')}px; 
      background-color: ${this.get('color')}; color: #fff;`;   
  }.property('amount') 
});

App.ScheduleController = Ember.ObjectController.extend({
  itemIndex: 0,
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
    if(!this.get('selectedDay')){ return; }
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
          obj = TaskObj.create({itemId: this.get('selectedDay.tasks.length') + 1, id: selectedTask.id, 
            name: selectedTask.name, color: (selectedTask.color) ? selectedTask.color : '#2196F3'});
      this.get('selectedDay.tasks').pushObject(obj);
    },
    removeTask(task){
      let arr = this.get('selectedTasks').filter((item) => {
        return item.itemId !== task.itemId;   
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
