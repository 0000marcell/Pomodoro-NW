App.MainView = Ember.View.extend({
  didInsertElement(){
    win.width = 500;
    win.height = 725;
    $('#main-clock').show();
  }
});
