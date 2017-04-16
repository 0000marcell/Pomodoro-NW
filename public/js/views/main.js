App.MainView = Ember.View.extend({
  didInsertElement(){
    win.width = 500;
    win.height = 765;
    $('#main-clock').show();
  }
});
