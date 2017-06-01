import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tag-form', 'column'],
  didInsertElement(){
    this.set('msgs', []);
  },
  didReceiveAttrs(){
    if(this.get('tag.name')){
      this.set('mode', 'edit');
    }else{
      this.set('mode', 'create');
    }
  },
  title: 'new task',
  tag: {name: '', description: '', 
    color: ''},
  actions: {
    saveTag(tag){
      this.get('saveTag')(tag).then(() => {
        this.set('msgs', ['tag saved!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }).catch(() => {
        this.set('msgs', ['an error occored!']);
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }); 
    },
    completeTag(tag){
      this.get('completeTag')(tag);
    }
  }
});
