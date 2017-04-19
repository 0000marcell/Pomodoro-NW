App.ScheduleController = Ember.ObjectController.extend({
  selectedTasks: [],
  daysOfTheWeek: [{day: 'monday', tasks: []}, 
                  {day: 'tuesday', tasks: []},
                  {day: 'wednesday', tasks: []},
                  {day: 'thrusday', tasks: []},
                  {day: 'friday', tasks: []},
                  {day: 'saturday', tasks: []},
                  {day: 'sunday', tasks: []}],
  totalTime: 0,
  actions: {
    addTask(){
      this.get('selectedTasks').pushObject(this.get('selectedTask'));
    }
  }
});
