App.TasksStatisticsController = Ember.ObjectController.extend({
  tasks: [],
  yearStart: null,
  yearEnd: null,
  isAdmin: true,
  selectedContentType: null,
  selectDate: [{label: "None", value: "none"},
        {label: "Today", value: "today"},
        {label: "Last 7 days", value: "7days"}],
  years: [],
  months: [{label: '1', value: 'January'}, 
           {label: '2', value: 'February'}, 
           {label: '3', value: 'March'}, 
           {label: '4', value: 'April'}, 
           {label: '5', value: 'May'}, 
           {label: '6', value: 'June'}, 
           {label: '7', value: 'July'}, 
           {label: '8', value: 'August'}, 
           {label: '9', value: 'September'}, 
           {label: '10', value:'October'}, 
           {label: '11', value: 'November'}, 
           {label: '12', value: 'December'}],
  tasksList:  [],
  mpMonth2015: null,
  mpMonth2016: null,
  mpMonth2017: null,
  mpDay2015: null,
  init(){
    var arr = [];
    this.store.findAll('task').then((tasks) => {
      this.set('tasks', tasks);
      arr = tasks.slice(0);
      this.set('tasksList', arr);
      this.get('tasksList')
        .unshiftObject({id: 'all', name: 'all'});
      let currentDate = new Date().getFullYear(),
        first = statistics.firstPomodoro(tasks),
        diff = currentDate - first + 1,
        years = Array.from(new Array(diff), (x,i) => i + first);
      this.set('years', years);
      this.set('yearStart', years[0]);
      this.set('monthStart', this.get('months').obje);
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
    calculateStatistics(){
      debugger;
      if(this.get('selectedTask.id') !== 'all'){
        selectedTasks = statistics.getTask(this.get('selectedTask.id'), this.get('tasks'));
      }else{
        selectedTasks = this.get('tasks'); 
      }
      let startYearString = `01/${monthStart.label}/${yearStart}`,
          endYearString = `${statistics.lastDayMonth(monthEnd.label, yearEnd)}/${monthEnd.label}/${yearEnd}`;
          resultPomodoros = statistics.getPomodoros(startYearString, endYearString, selectedTasks);
    }
  }
});
