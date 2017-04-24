const TaskObj = Ember.Object.extend({
  data: null,
  width: 50,
  amount: 1,
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
  selectedDay: daysOfTheWeek[0],
  selectedTasks: daysOfTheWeek[0].tasks,
  daysOfTheWeek: daysOfTheWeek,
  changeDay: function() {
    this.set('selectedTasks', 
      this.get('selectedDay.tasks'));
  }.observes('selectedDay'),
  totalTime: 0,
  actions: {
    addTask(){
      //clone the object
      let obj = TaskObj.create({data: this.get('selectedTask')._data});
      this.get('selectedDay.tasks').pushObject(obj);
    }
  }
});
