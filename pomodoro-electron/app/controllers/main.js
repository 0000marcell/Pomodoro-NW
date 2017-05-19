import Ember from 'ember';

export default Ember.Controller.extend({
  clock: {
    state: 'paused',
    mode: 'pomodoro',
    time: 5,
    shortInterval: 10,
    longInterval: 10
  }
});
