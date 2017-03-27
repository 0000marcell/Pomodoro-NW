const months = [{label: '1', value: 'January'}, 
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
             {label: '12', value: 'December'}];

App.StatisticsController = Ember.ObjectController.extend({
  tasks: [],
  isAdmin: true,
  selectDate: [{label: "None", value: "none"},
        {label: "Today", value: "today"},
        {label: "Last 7 days", value: "7days"}],
  years: [],
  months: months,
  tasksList:  [],
  todayPomodoros: [],
  weekPomodoros: [],
  load(){
    let tasks = this.get('model'),
        arr = [],
        allTask = {id: 'all', name: 'all'};
    this.set('pomAverage', `${statistics.pomAverage(tasks)} h`);
    this.set('tasks', tasks);
    arr = tasks.slice(0);
    this.set('tasksList', arr);
    this.get('tasksList')
      .unshiftObject(allTask);
    this.set('selectedTask', allTask);
    let currentDate = new Date().getFullYear(),
      first = statistics.firstPomodoro(tasks).getFullYear(),
      diff = currentDate - first + 1,
      years = Array.from(new Array(diff), (x,i) => i + first);
    this.set('years', years);
    this.set('yearStart', years[0]);
    this.set('monthStart', this.get('months').objectAt(0));
    this.set('yearEnd', years[years.length - 1]);
    this.set('monthEnd', this.get('months').objectAt(this.get('months.length') - 1));
      /*
      statistics.loadBarChart()
                .loadD3Calendar();
      */
    this.set('mpMonth2015', 
      statistics.mostProductiveMonth(tasks, 2015));
    this.set('mpMonth2016', 
      statistics.mostProductiveMonth(tasks, 2016));
    this.set('mpMonth2017', 
      statistics.mostProductiveMonth(tasks, 2017));
    let todayPomodoros = statistics.todayPomodoros(tasks);
    this.set('todayPomodoros', todayPomodoros);
    this.set('todayTotal', 
        `${this.get('todayPomodoros').filterBy('name', 'total')[0].time}h`);
    let weekPomodoros = statistics.weekPomodoroH(tasks);
    this.set('weekPomodoros', weekPomodoros);
    this.set('weekTotal', 
        `${weekPomodoros.filterBy('name', 'total')[0].time}h`);
  },
  actions: { 
    calculateStatistics(){
      let selectedIds = (this.get('selectedTask.id') !== 'all') ? [this.get('selectedTask.id')] :
                                                                  [];
      let tasks;
      if(selectedIds.length){
        tasks = statistics.filterTasks(this.get('tasks'), selectedIds);
      }else{
        tasks = this.get('tasks');
      }
      let lastDayMonth = statistics.lastDayMonth(this.get('monthEnd.label'), this.get('yearEnd')),
          startYearString = `01/${this.get('monthStart.label')}/${this.get('yearStart')}`,
          endYearString = `${lastDayMonth}/${this.get('monthEnd.label')}/${this.get('yearEnd')}`;
      tasks = statistics.filterPomodoros(tasks, startYearString, endYearString);
      this.set('tasksTotalTime', 
          statistics.get('tasksTotalTime'));
      graph.loadBarChart(tasks)
      /*
      .loadBarChart()
      .loadD3Calendar();
      */
    }
  }
});
