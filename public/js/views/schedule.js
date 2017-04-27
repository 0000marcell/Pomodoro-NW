App.ScheduleView= Ember.View.extend({
  didInsertElement(){
    let controller =  App.__container__
      .lookup('controller:schedule');
    controller.set('saveMessage', false);
    controller.set('selectedDay', daysOfTheWeek[0]);
    controller.set('selectedTasks', daysOfTheWeek[0].tasks);
    controller.set('daysOfTheWeek', daysOfTheWeek);
    $('#main-clock').hide();
    win.width = 800;
    win.height = 800;
  }
});
