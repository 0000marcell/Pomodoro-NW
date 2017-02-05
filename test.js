statistics.init(tasks)
              .filterPomodoros();
    this.set('tasks', tasks);
    arr = tasks.slice(0);
    this.set('tasksList', arr);
    this.get('tasksList')
      .unshiftObject(allTask);
    this.set('selectedTask', allTask);
    let currentDate = new Date().getFullYear(),
      first = statistics.firstPomodoro().getFullYear(),
      diff = currentDate - first + 1,
      years = Array.from(new Array(diff), (x,i) => i + first);
    this.set('years', years);
    this.set('yearStart', years[0]);
    this.set('monthStart', this.get('months').objectAt(0));
    this.set('yearEnd', years[years.length - 1]);
    this.set('monthEnd', this.get('months').objectAt(this.get('months.length') - 1));
    statistics.loadBarChart()
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
    let todayPomodoros = statistics.resetFilter().todayPomodoros();
    this.set('todayPomodoros', todayPomodoros);
    this.set('todayTotal', 
        `${this.get('todayPomodoros').filterBy('name', 'total')[0].time}h`);
    let weekPomodoros = statistics.resetFilter().weekPomodoroH();
    this.set('weekPomodoros', weekPomodoros);
    this.set('weekTotal', 
        `${weekPomodoros.filterBy('name', 'total')[0].time}h`);
