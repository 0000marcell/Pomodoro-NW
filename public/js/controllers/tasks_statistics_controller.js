App.TasksStatisticsController = Ember.ObjectController.extend({
  tasks: null,
  mostProductiveMonth: null,
  init(){
    this.store.findAll('task').then((tasks) => {
      this.set('tasks', tasks);
      statistics.getStatistics(tasks, 7); 
      statistics.loadD3Calendar(tasks);
      this.set('mostProductiveMonth', 
        statistics.mostProductiveMonth(tasks, 2015));
    });
  },
  actions: { 
    setPeriod: function(period){
      _this = this;
      this.store.find('task').then(function(tasks){
        statistics.getStatistics(tasks, period);
      });
    }
    // Statistics logic is in helpers/pomodoroStatistics.js
  }
});
