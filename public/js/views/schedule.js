App.ScheduleView= Ember.View.extend({
  didInsertElement(){
    $('#main-clock').hide();
    win.width = 800;
    win.height = 800;
  }
});
