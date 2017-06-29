import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-form', 'column'],
  didInsertElement(){
    this.set('msgs', []);
  },
  didReceiveAttrs(){
    if(this.get('task.name')){
      this.set('mode', 'edit');
    }else{
      this.set('mode', 'create');
    }
    this.set('sidenavPanel', 
      this.get('register')());
    this.get('sidenavPanel')
      .set('taskForm', this);
  },
  actions: {
    saveTask(task){
      this.get('saveTask')(task).then(() => {
        this.set('msgs', ['task saved!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
        this.get('sidenavPanel').reloadList();
      }).catch(() => {
        this.set('msgs', ['an error occored!']); 
        Ember.run.later(this, () => {
          this.set('msgs', []);
        }, 5000);
      }); 
    },
    completeTask(task){
      this.get('completeTask')(task).then(() => {
        this.get('sidenavPanel').reloadList();
        this.set('msgs', ['task completed!']); 
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
