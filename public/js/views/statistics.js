App.StatisticsView= Ember.View.extend({
  didInsertElement(){
    let controller =  App.__container__
      .lookup('controller:statistics');
    controller.set('loading', true);
    Ember.run.later(this, () => {
      controller.set('mpMonths', []);
      controller.load();
      controller.set('loading', false);
    }, 300);
  }
});
