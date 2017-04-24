const WeekDay = Ember.Object.extend({
  day: null,
  tasks: [],
  style: function(){
    return `width: ${this.get('width')}px; 
      background-color: ${this.get('color')}; color: #fff;`;   
  }.computed('width', 'color') 
});

let daysOfTheWeek = [];
['monday', 'tuesday', 'wednesday', 
  'thrusday', 'friday', 'saturday', 'sunday'].forEach((item) => {
  daysOfTheWeek.push(WeekDay.create({day: item})); 
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
      debugger;
      let obj = (JSON.parse(JSON.stringify(this.get('selectedTask')._data)));
      obj['amount'] = 0;
      let color, width;
      if(!obj['color']){
        obj['color'] = '#2196F3';
      }
      color = obj['color'];
      width = 50;
      obj['style'] = 
        `width: ${width}px; background-color: ${color}; color: #fff;`;
      this.get('selectedDay.tasks').pushObject(obj);
    }
  }
});
