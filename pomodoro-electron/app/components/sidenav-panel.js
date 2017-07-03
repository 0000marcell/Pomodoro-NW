import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  listMode: 'tasks',
  dynComp: {
    name: '',
    title: '',
    mode: {model: '', 
      saveAction: 'createTask',
      completeAction}
  },
  reloadList(){
    this.get('sidenavList').loadList();
  },
  actions: {
    register(){
      return this;
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
