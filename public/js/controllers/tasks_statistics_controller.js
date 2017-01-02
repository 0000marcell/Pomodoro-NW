App.TasksStatisticsController = Ember.ObjectController.extend({
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
