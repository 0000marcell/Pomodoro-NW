App.TasksStatisticsController = Ember.ObjectController.extend({
  tasks: [],
  yearStart: null,
  monthStart: null,
  monthEnd: null,
  yearEnd: null,
  isAdmin: true,
  selectedContentType: null,
  selectedTask: null,
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
  todayPomodoros: [],
  weekPomodoros: [],
  mpMonth2015: null,
  mpMonth2016: null,
  mpMonth2017: null,
  mpDay2015: null,
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
