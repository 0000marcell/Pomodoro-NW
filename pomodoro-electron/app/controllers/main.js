import Ember from 'ember';

export default Ember.Controller.extend({
  clock: {
    state: 'paused',
    mode: 'pomodoro'
  }
});
