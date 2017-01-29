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
    let arr = [],
        allTask = {id: 'all', name: 'all'};
    this.store.findAll('task').then((tasks) => {
      this.set('tasks', tasks);
      arr = tasks.slice(0);
      this.set('tasksList', arr);
      this.get('tasksList')
        .unshiftObject(allTask);
      this.set('selectedTask', allTask);
      let currentDate = new Date().getFullYear(),
        first = statistics.firstPomodoro(tasks),
        diff = currentDate - first + 1,
        years = Array.from(new Array(diff), (x,i) => i + first);
      this.set('years', years);
      this.set('yearStart', years[0]);
      this.set('monthStart', this.get('months').objectAt(0));
      this.set('yearEnd', years[years.length - 1]);
      this.set('monthEnd', this.get('months').objectAt(this.get('months.length') - 1));
      //statistics.loadStatistics(statistics.getPomodoros(tasks));
      statistics.init(tasks).filterTasks(["0"])
                            .filterPomodoros()
                            .loadBarChart()
                            .loadD3Calendar();
      this.set('mpMonth2015', 
        statistics.mostProductiveMonth(2015));
      this.set('mpMonth2016', 
        statistics.mostProductiveMonth(2016));
      this.set('mpMonth2017', 
        statistics.mostProductiveMonth(2017));
      this.set('mpDay2015', 
        statistics.mostProductiveDay(2015));
      this.set('mpDay2016', 
        statistics.mostProductiveDay(2016));
       this.set('mpDay2017', 
        statistics.mostProductiveDay(2017));
    });
  },
  actions: { 
    calculateStatistics(){
      let selectedIds = (this.get('selectedTask.id') !== 'all') ? [this.get('selectedTask.id')] :
                                                                  [];
      let lastDayMonth = statistics.lastDayMonth(this.get('monthEnd.label'), this.get('yearEnd')),
          startYearString = `01/${this.get('monthStart.label')}/${this.get('yearStart')}`,
          endYearString = `${lastDayMonth}/${this.get('monthEnd.label')}/${this.get('yearEnd')}`;
      statistics.resetFilter() 
                .filterTasks(selectedIds)
                .filterPomodoros(startYearString, endYearString)
                .loadBarChart()
                .loadD3Calendar();
    }
  }
});
