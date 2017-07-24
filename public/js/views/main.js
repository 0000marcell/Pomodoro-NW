App.MainView = Ember.View.extend({
  didInsertElement(){
    let controller = 
      App.__container__.lookup("controller:main");
    controller.filterModel();
    win.width = 500;
    win.height = 785;
    $('#main-clock').show();
  }
});
