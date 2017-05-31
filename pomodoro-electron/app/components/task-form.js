import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-form', 'column'],
  didInsertElement(){
    this.set('msgs', []);
  },
  didReceiveAttrs(){
    if(this.get('task.name')){
      this.set('mode', 'edit');
    }else{
      this.set('mode', 'create');
    }
  },
  actions: {
    saveTask(task){
      this.get('saveTask')(task).then(() => {
        this.set('msgs', ['task saved!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }).catch(() => {
        this.set('msgs', ['an error occored!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }); 
    },
    deleteTask(task){
      console.log('deleteTask');
    }
  }
});
