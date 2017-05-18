import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('main');
  this.route('schedule');
  this.route('statistics');
  this.route('configuration');
  this.route('testing');
});

export default Router;
