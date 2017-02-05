App.TasksStatisticsRoute = Ember.Route.extend({
  model(){
    return this.store.findAll('task');
  },
  setupController: function(controller, model) {
    let arr = [],
        allTask = {id: 'all', name: 'all'},
        tasks = model;
    statistics.init(tasks)
              .filterPomodoros();
    controller.set('tasks', tasks);
    arr = tasks.slice(0);
    controller.set('tasksList', arr);
    controller.get('tasksList')
      .unshiftObject(allTask);
    controller.set('selectedTask', allTask);
    let currentDate = new Date().getFullYear(),
      first = statistics.firstPomodoro().getFullYear(),
      diff = currentDate - first + 1,
      years = Array.from(new Array(diff), (x,i) => i + first);
    controller.set('years', years);
    controller.set('yearStart', years[0]);
    controller.set('monthStart', controller.get('months').objectAt(0));
    controller.set('yearEnd', years[years.length - 1]);
    controller.set('monthEnd', controller.get('months').objectAt(controller.get('months.length') - 1));
    statistics.loadBarChart()
              .loadD3Calendar();
    controller.set('mpMonth2015', 
      statistics.mostProductiveMonth(2015));
    controller.set('mpMonth2016', 
      statistics.mostProductiveMonth(2016));
    controller.set('mpMonth2017', 
      statistics.mostProductiveMonth(2017));
    controller.set('mpDay2015', 
      statistics.mostProductiveDay(2015));
    controller.set('mpDay2016', 
      statistics.mostProductiveDay(2016));
    controller.set('mpDay2017', 
      statistics.mostProductiveDay(2017));
    let todayPomodoros = statistics.resetFilter().todayPomodoros();
    controller.set('todayPomodoros', todayPomodoros);
    controller.set('todayTotal', 
        `${controller.get('todayPomodoros').filterBy('name', 'total')[0].time}h`);
    let weekPomodoros = statistics.resetFilter().weekPomodoroH();
    controller.set('weekPomodoros', weekPomodoros);
    controller.set('weekTotal', 
        `${weekPomodoros.filterBy('name', 'total')[0].time}h`);
  }
});

