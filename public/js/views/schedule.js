App.ScheduleView= Ember.View.extend({
  didInsertElement(){
    let controller =  App.__container__
      .lookup('controller:schedule');
    controller.set('itemIndex', 0);
    controller.set('saveMessage', false);
    controller.set('selectedDay', store.schedule[0]);
    controller.set('selectedTasks', store.schedule[0].tasks);
    controller.set('daysOfTheWeek', store.schedule);
    $('#main-clock').hide();
    win.width = 800;
    win.height = 800;
  }
});
