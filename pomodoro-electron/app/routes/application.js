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
      let tasks = this.get('data.storage.tasks'),
          obj = {id: tasks.length + 1, name: task.name, 
                description: task.description, 
                tag: task.tag,
                pomodoros: []};
      this.get('data.storage.tasks')
        .pushObject(obj);
      return this.saveToStore(); 
    },
    completeTask(task){
      console.log('complete task!', task.id);
    },
    editTask(){
      return this.saveToStore(); 
    },
    createTag(tag){
      let tags = this.get('data.storage.tags'),
          obj = {id: tags.length + 1, name: tag.name,
            description: tag.description, color: tag.color};
      this.get('data.storage.tags')
        .pushObject(obj);
      return this.saveToStore(); 
    },
    completeTag(tag){
      console.log('complete tag!', tag.id);
    },
    editTag(){
      return this.saveToStore(); 
    }
  }
});
