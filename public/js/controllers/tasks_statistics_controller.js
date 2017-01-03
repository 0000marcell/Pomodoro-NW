App.TasksStatisticsController = Ember.ObjectController.extend({
  tasks: null,
  mpMonth2015: null,
  mpMonth2016: null,
  mpMonth2017: null,
  init(){
    this.store.findAll('task').then((tasks) => {
      this.set('tasks', tasks);
      statistics.getStatistics(tasks, 7); 
      statistics.loadD3Calendar(tasks);
      this.set('mpMonth2015', 
        statistics.mostProductiveMonth(tasks, 2015));
      this.set('mpMonth2016', 
        statistics.mostProductiveMonth(tasks, 2016));
      this.set('mpMonth2017', 
        statistics.mostProductiveMonth(tasks, 2017));
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
