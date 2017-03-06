App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('task');
  },
  afterModel(){
    this.transitionTo('main');
  }
});
