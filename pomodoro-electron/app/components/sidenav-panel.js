import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  listMode: 'tasks',
  compName: 'tag-form',
  mode: {model: '', saveAction: 'createTask'},
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
