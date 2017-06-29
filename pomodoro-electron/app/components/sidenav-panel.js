import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  listMode: 'tasks',
  mode: {model: '', saveAction: 'createTask'},
  reloadList(){
    console.log('reload list!');
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
