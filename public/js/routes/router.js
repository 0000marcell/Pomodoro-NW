App.Router.map(function() {
  this.route('main');
  this.route('new');
  this.route('edit', {path: '/:task_id/edit'});
  this.route('statistics');
  this.resource('config');
});
