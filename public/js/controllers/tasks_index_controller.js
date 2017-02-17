App.IndexController = Ember.ArrayController.extend({
  needs: ['tasks'],
  sortProperties: ['name']
});
