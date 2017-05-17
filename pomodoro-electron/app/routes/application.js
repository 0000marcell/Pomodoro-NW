import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  data: {
    storage: data,
    state: {selectedTask: null}
  },
  model(){
    return  this.get('data');
  },
  redirect(){
    this.transitionTo('main');
  },
  actions: {
    createTask(task){
      console.log('create task!');
      /*
      this.get('data.storage.tasks')
        .pushObject(task); 
      this.get('store')
        .persist(this.get('data.storage'));
        */
    },
    editTask(){
      console.log('edit task!');
      this.get('store')
        .persist(this.get('data.storage'));
    },
    newTask(){
      return {name: null, 
        description: null, pomodoros: []};   
    }
  }
});
