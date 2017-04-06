App.StatisticsView= Ember.View.extend({
  didInsertElement(){
    return new Ember.RSVP.Promise((resolve) => {
      App.__container__
      .lookup('controller:statistics')
      .load();  
      resolve();
    });
  }
});
