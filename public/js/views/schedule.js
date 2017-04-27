App.ScheduleView= Ember.View.extend({
  didInsertElement(){
    let controller =  App.__container__
      .lookup('controller:schedule');
    controller.set('saveMessage', false);
    $('#main-clock').hide();
    win.width = 800;
    win.height = 800;
  }
});
