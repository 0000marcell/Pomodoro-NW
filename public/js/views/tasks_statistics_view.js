App.TasksStatisticsView= Ember.View.extend({
  didInsertElement: function(){
    appWindow.resize(900, 640);
    App.Task.store.find('task').then(function(tasks){
      statistics.getStatistics(tasks, 7); 
      statistics.loadD3Calendar(tasks);
    });
  }
});