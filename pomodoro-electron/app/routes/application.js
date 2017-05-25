import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  data: {
    storage: data,
    state: {selectedTask: null,
            selectedTag: null}
  },
  model(){
    return  this.get('data');
  },
  redirect(){
    //this.transitionTo('main');
  },
  saveToStore(){
    return this.get('store')
        .persist(this.get('data.storage'));
  },
  actions: {
    createTask(task){
      return this.saveToStore(); 
    },
    editTask(){
      return this.saveToStore(); 
    },
    createTag(tag){
      return this.saveToStore(); 
    },
    editTag(){
      return this.saveToStore(); 
    }
  }
});
