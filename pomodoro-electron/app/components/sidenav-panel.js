import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  listMode: 'tasks',
  newTag: {name: null, description: null,
    color: null},
  newTask: {name: null, description: null, 
    pomodoros: []},
  actions: {
    overlayClick(){
      this.set('leftPanel', false);
      this.set('openSidenav', false);
    },
    showLeftPanel(){
      this.toggleProperty('leftPanel');
    }
  }
});
