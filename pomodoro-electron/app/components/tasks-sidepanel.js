import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  actions: {
    edit(task){
      this.set('leftPanel', true);
      this.set('selectedTask', task);
    },
    overlayClick(){
      this.toggleProperty('openSidenav');
    },
    showLeftPanel(){
      this.toggleProperty('leftPanel');
    }
  }
});
