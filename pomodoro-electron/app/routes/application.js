import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  data: {
    storage: data,
    state: {selectedItem: null}
  },
  model(){
    return  this.get('data');
  },
  redirect(){
    this.transitionTo('main');
  },
  actions: {
    createTask(task){
      /*
      this.get('data.storage.tasks')
        .pushObject(task); 
      this.get('store')
        .persist(this.get('data.storage'));
        */
    },
    editTask(){
      this.get('store')
        .persist(this.get('data.storage'));
    },
    newTask(){
      return {id: this.get('data.storage.tasks.length') + 1, 
        name: null, 
        description: null, pomodoros: []};   
    },
    createTag(tag){
      console.log('create tag!');
    },
    editTag(){
      console.log('edit tag!');
    },
    newTag(){
      return {id: this.get('data.storage.tags.length') + 1, 
        name: null, 
        description: null,
        color: null};   
    }
  }
});
