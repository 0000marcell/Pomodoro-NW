import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  actions: {
    overlayClick(){
      this.toggleProperty('openSidenav');
    },
    showLeftPanel(){
      this.toggleProperty('leftPanel');
    }
  }
});
