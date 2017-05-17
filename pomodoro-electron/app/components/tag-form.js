import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['edit-tag-comp', 'column'],
  actions: {
    saveTag(tag){
      this.get('saveTag')(tag); 
    }
  }
});
