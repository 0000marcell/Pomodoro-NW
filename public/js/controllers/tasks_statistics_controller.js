App.TasksStatisticsController = Ember.ObjectController.extend({
  years: [],
  tasks: null,
  mpMonth2015: null,
  mpMonth2016: null,
  mpMonth2017: null,
  mpDay2015: null,
  init(){
    this.store.findAll('task').then((tasks) => {
      let currentDate = new Date().getFullYear(),
        first = statistics.firstPomodoro(tasks),
        diff = currentDate - first + 1,
        years = Array.from(new Array(diff), (x,i) => i + first);
      this.set('years', years);
      statistics.getStatistics(tasks, 7); 
      statistics.loadD3Calendar(tasks);
      this.set('mpMonth2015', 
        statistics.mostProductiveMonth(tasks, 2015));
      this.set('mpMonth2016', 
        statistics.mostProductiveMonth(tasks, 2016));
      this.set('mpMonth2017', 
        statistics.mostProductiveMonth(tasks, 2017));
      this.set('mpDay2015', 
        statistics.mostProductiveDay(tasks, 2015));
      this.set('mpDay2016', 
        statistics.mostProductiveDay(tasks, 2016));
       this.set('mpDay2017', 
        statistics.mostProductiveDay(tasks, 2017));
    });
  },
  actions: { 
    setPeriod: function(period){
      _this = this;
      this.store.find('task').then(function(tasks){
        statistics.getStatistics(tasks, period);
      });
    },
    selectYearStart(){
      let selected = $("#year-start option:selected").text();
    },
    selectMonthStart(){
    },
    selectYearEnd(){
    },
    selectMonthEnd(){
    }
    // Statistics logic is in helpers/pomodoroStatistics.js
  }
});
