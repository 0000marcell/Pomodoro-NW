App.ScheduleController = Ember.ObjectController.extend({
  schedule: [{day: 'monday', tasks: [{id: 1, name: 'task1', pomodoros: 3}, 
             {id: 2, name: 'task2', pomodoros: 4}]}, 
             {day: 'tuesday', tasks: [{id: 3, name: 'task3', pomodoors: 5},
             {id: 4, name: 'task4', pomodoros: 5}]}],
  totalTime: 0,
  tasks: [],
  daysOfTheWeek: [],
  actions: {
    addTask(){
    }
  }
});
