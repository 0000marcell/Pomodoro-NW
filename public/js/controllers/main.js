App.MainController = Ember.ArrayController.extend({
  needs: ['tasks'],
  sortProperties: ['name']
});
