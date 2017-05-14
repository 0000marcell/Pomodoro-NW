import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      data: data,
      state: {selectedTask: null}
    });
  },
  redirect(){
    this.transitionTo('main');
  }
});
