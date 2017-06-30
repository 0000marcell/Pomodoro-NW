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

  // seed the db 
  seed(){
    for(let key in data){
      for(let value of data[key]){
        console.log(key);
        this.store.createRecord(key, value).save()
          .then((val) => {
          console.log('value inserted');  
        }).catch((error) => {
          console.error(`
            error trying to seed the db!: ${error}
          `);
        });    
      }
    }
  },
  model(){
    //this.seed();
    return Ember.RSVP.hash({
      tasks: this.store.findAll('task'),
      tags: this.store.findAll('tag'),
      state: this.get('state') 
    });   
  },
  redirect(){
    //this.transitionTo('main');
  },
  actions: {
    showSidenav(){
      this.get('controller')
        .toggleProperty('openSidenav');
    },
    changeSelected(item){
      if(this.get('state.clock.state') === 'paused'){
        this.set('state.selectedTask', item);
        return;
      }else{
        let controller = this.get('controller');
        controller.set('showDialog', true);
        controller.set('popTitle', 'stop clock!');
        controller.set('popMsg', `
        are you sure you wanna change the task,
        clock gonna be reseted
        `);
        controller.set('dialogCB', (val) => {
          if(val){
            this.set('state.selectedTask', item);
            this.get('state.clock.reset')();
          }
        });
      }
    },
    createTask(task){
      return this.store.createRecord('task', task).save();
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
      return this.store.createRecord('tag', tag).save();
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
