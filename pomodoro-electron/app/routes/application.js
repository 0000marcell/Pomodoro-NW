import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  setupController(controller, post) {
    this._super(controller, post);
    this.set('controller', controller);
  },
  data: {
    storage: data,
    state: {selectedTask: null,
            selectedTag: null,
            clock: {
              state: 'paused',
              mode: 'pomodoro',
              time: 5,
              shortInterval: 10,
              longInterval: 15,
              streak: 0,
              pausedByUser: false,
              env: null
            }
    }
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
    changeSelected(item, mode){
      let controller = this.get('controller');
      controller.set('showDialog', true);
      controller.set('popTitle', 'stop clock!');
      controller.set('popMsg', `
      are you sure you wanna change the task,
      clock gonna be reseted
      `);
      controller.set('dialogCB', (val) => {
        if(val){
          console.log('reset task!');
          let env = this.get('clock.env');
          debugger;
        }else{
          console.log('dont reset!');
        }
      });
    },
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
      task.active = false;
      return this.saveToStore(); 
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
      tag.active = false;
      return this.saveToStore(); 
    },
    editTag(){
      return this.saveToStore(); 
    }
  }
});
