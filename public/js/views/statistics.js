App.StatisticsView= Ember.View.extend({
  didInsertElement(){
    App.__container__
    .lookup('controller:statistics')
    .load();
  }
});
