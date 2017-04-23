let daysOfTheWeek = [{day: 'monday', tasks: []}, 
                    {day: 'tuesday', tasks: []},
                    {day: 'wednesday', tasks: []},
                    {day: 'thrusday', tasks: []},
                    {day: 'friday', tasks: []},
                    {day: 'saturday', tasks: []},
                    {day: 'sunday', tasks: []}];

App.ScheduleController = Ember.ObjectController.extend({
  selectedDay: daysOfTheWeek[0],
  selectedTasks: daysOfTheWeek[0].tasks,
  daysOfTheWeek: daysOfTheWeek,
  changeDay: function() {
    this.set('selectedTasks', 
      this.get('selectedDay.tasks'));
  }.observes('selectedDay'),
  changeAmount: function(){
    this.get('selectedTasks').forEach((task) => {
      let width = 0;
      if(task.amount){
        width = task.amount * 10;  
        task.style = 
        `width: ${width}px; background-color: ${task.color}; color: #fff;`;
      }
    });
  }.observes('selectedTasks.@each.amount'),
  totalTime: 0,
  actions: {
    addTask(){
      //clone the object
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
