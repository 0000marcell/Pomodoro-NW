App.TasksIndexController = Ember.ArrayController.extend({
  needs: ['tasks'],
  sortProperties: ['name']
});