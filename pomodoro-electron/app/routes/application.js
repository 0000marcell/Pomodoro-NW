import Ember from 'ember';
import data from './data';

export default Ember.Route.extend({
  setupController(controller, post) {
    this._super(controller, post);
    this.set('controller', controller);
  },
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
      reset: null
    }
  },
  model(){
    return Ember.RSVP.hash({
      tasks: this.store.findAll('task'),
      tags: this.store.findAll('tag'),
      state: this.get('state') 
    });
  },
  redirect(){
    //this.transitionTo('main');
  },
  saveToStore(){
    this.store.createRecord('task', {name: 'testing', 
      description: 'description'}).save().then((val) => {
         console.log(`value saved ${val}`);
      }).catch((error) => {
         console.error(error);
      });
  },
  actions: {
    showSidenav(){
      this.get('controller')
        .toggleProperty('openSidenav');
    },
    changeSelected(item, mode){
      if(this.get('data.state.clock.state') === 'paused'){
        return;
      }
      let controller = this.get('controller');
      controller.set('showDialog', true);
      controller.set('popTitle', 'stop clock!');
      controller.set('popMsg', `
      are you sure you wanna change the task,
      clock gonna be reseted
      `);
      controller.set('dialogCB', (val) => {
        if(val){
          this.get('data.state.clock.reset')();
        }
      });
    },
    createTask(task){
      reutrn this.store.createRecord('task', {name: task.name, 
        description: task.description}).save();
    },
    completeTask(task){
      console.log('complete task!', task.id);
      task.set('active', false);
      return task.save();
    },
    editTask(task){
      return task.save();
    },
    createTag(tag){
      reutrn this.store.createRecord('tag', {name: tag.name, 
        description: tag.description, color: tag.color}).save();
    },
    completeTag(tag){
      console.log('complete task!', tag.id);
      tag.set('active', false);
      return tag.save();
    },
    editTag(tag){
      return tag.save(); 
    }
  }
});
