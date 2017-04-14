App.MainView = Ember.View.extend({
  didInsertElement(){
    win.width = 500;
    win.height = 745;
    $('#main-clock').show();
  }
});
