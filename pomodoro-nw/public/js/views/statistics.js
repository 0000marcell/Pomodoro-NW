App.StatisticsView= Ember.View.extend({
  didInsertElement(){
    $('#main-clock').hide();
    let controller =  App.__container__
      .lookup('controller:statistics');
    win.width = 800;
    win.height = 800;
    controller.set('loading', true);
    Ember.run.later(this, () => {
      controller.set('mpMonths', []);
      controller.load();
      controller.set('loading', false);
    }, 300);
  }
});
