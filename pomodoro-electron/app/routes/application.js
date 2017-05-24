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
    this.get('store')
        .persist(this.get('data.storage'));
  },
  actions: {
    createTask(task){
      console.log('create task: ', task);
      this.saveToStore(); 
    },
    editTask(){
      console.log('edit task');
      this.saveToStore(); 
    },
    createTag(tag){
      console.log('create tag!', tag);
      this.saveToStore(); 
    },
    editTag(){
      console.log('edit tag!');
      this.saveToStore(); 
    }
  }
});
