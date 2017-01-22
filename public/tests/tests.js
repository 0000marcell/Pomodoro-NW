debugger;
App.rootElement = '#ember-testing';

setResolver(Ember.DefaultResolver.create({namespace: App}));
App.setupForTesting();
App.injectTestHelpers();

module("Integration tests", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    App.reset();
  }
});
