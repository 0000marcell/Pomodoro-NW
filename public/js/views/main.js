App.MainView = Ember.View.extend({
  didInsertElement(){
    win.width = 500;
    win.height = 785;
    $('#main-clock').show();
  }
});
