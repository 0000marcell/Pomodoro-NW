import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.set('msgs', []);
  },
  classNames: ['edit-tag-comp', 'column'],
  title: 'new task',
  tag: {name: '', description: '', 
    color: ''},
  actions: {
    saveTag(tag){
      this.get('saveTag')(tag).then(() => {
        this.set('msgs', ['tag saved!']); 
      }).catch(() => {
        this.set('msgs', ['an error occored!']);
      }); 
    }
  }
});
