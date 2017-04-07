App.StatisticsView= Ember.View.extend({
  setupController(controller, model){
    console.log('setup controller');
  },
  didInsertElement(){
    console.log('did insert elements');
    Ember.run.later(this, () => {
      App.__container__
      .lookup('controller:statistics')
      .load();
    }, 300);
  }
});
