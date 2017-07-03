import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  listMode: 'tasks',
  dynComp: {
    name: null,
    model: '', 
    saveAction: '',
    completeAction: ''
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
