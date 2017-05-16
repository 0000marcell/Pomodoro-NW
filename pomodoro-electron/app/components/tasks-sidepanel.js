import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  actions: {
    showEdit(task){
      this.set('leftPanel', true);
      this.set('selectedTask', task);
    },
    showCreate(){
      let task = this.get('newTask')()
      this.set('newTask', task);
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
