App.NewRoute = Ember.Route.extend({
  model: function() {
    return {id: null, 
            name: null, creation_date: null,
            formated_creation_date: null, last_active: null,
            pomodoros: [], duration: null, totalTime: null}; 
  }
});

