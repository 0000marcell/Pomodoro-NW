App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    this.store.push('tasks', {
        id: 1,
        title: "Fewer Moving Parts",
        artist: "David Bazan",
        songCount: 10
        
    });
    return this.store.findAll('task');
  },
  afterModel(){
    this.transitionTo('main');
  }
});
