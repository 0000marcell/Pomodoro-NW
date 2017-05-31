import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pop-dialog'],
  classNameBindings: ['showDialog'],
  showDialog: true,
  actions: {
    close(val){
      this.set('showDialog', false);
      this.set('result', val);
    }
  }
});
