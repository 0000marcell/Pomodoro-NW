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
    this.set('sidenavPanel', 
      this.get('register')());
    this.get('sidenavPanel')
      .set('tagForm', this);
  },
  title: 'new tag',
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
      this.get('completeTag')(tag).then(() => {
        this.get('sidenavPanel').reloadList();
        this.set('msgs', ['tag completed!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }).catch((error) => {
        this.set('msgs', [`error: ${error}`]); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      });
    }
  }
});
