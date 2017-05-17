import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  actions: {
    showEditTask(task){
      this.set('mode', 'editTask');
      this.set('selectedTask', task);
      this.set('leftPanel', true);
    },
    showCreateTask(){
      this.set('mode', 'createTask');
      let task = this.get('newTask')()
      this.set('newTask', task);
      this.set('leftPanel', true);
    },
    overlayClick(){
      this.set('leftPanel', false);
      this.set('openSidenav', false);
    },
    showLeftPanel(){
      this.toggleProperty('leftPanel');
    }
  }
});
