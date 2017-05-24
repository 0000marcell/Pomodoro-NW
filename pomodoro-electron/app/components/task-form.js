import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['edit-task-comp', 'column'],
  actions: {
    saveTask(task){
      this.get('saveTask')(task).then(() => {
        this.set('msgs', ['task saved!']); 
      }).catch(() => {
        this.set('msgs', ['an error occored!']); 
      }); 
    }
  }
});
