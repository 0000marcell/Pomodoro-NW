App.TasksStatisticsView= Ember.View.extend({
  didInsertElement: function(){
    appWindow.resize(950, 770);
    App.Task.store.find('task').then(function(tasks){
      statistics.getStatistics(tasks, 7); 
      statistics.loadD3Calendar(tasks);
      statistics.mostProductiveMonth(tasks);
    });
  }
});
