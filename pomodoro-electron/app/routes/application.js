import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  data: Ember.RSVP.hash({
      data: data,
      state: {selectedTask: null}
  }),
  model(){
    return  this.get('data');
  },
  redirect(){
    this.transitionTo('main');
  },
  actions: {
    create(task){
      //this.get('data').pushObject(task); 
    },
    edit(task){
    }
  }
});
