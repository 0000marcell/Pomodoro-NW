App.MainView = Ember.View.extend({
  didInsertElement(){
    win.width = 500;
    win.height = 775;
    $('#main-clock').show();
  }
});
