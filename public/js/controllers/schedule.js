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
