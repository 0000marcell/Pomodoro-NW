import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav'],
  actions: {
    overlayClick(){
      this.toggleProperty('openSidenav');
    }
  }
});
