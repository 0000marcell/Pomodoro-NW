import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['openSidenav', 'leftPanel'],
  actions: {
    showEditTask(task){
      this.set('mode', 'editTask');
      this.set('selectedTask', task);
      this.set('leftPanel', true);
    },
    showCreateTask(){
      this.set('mode', 'createTask');
      let task = this.get('newTask')()
      this.set('taskObj', task);
      this.set('leftPanel', true);
    },
    showCreateTag(){
      this.set('mode', 'createTag');
      let tag = this.get('newTag')()
      this.set('tagObj', tag);
      this.set('leftPanel', true);
    },
    showEditTag(tag){
      this.set('mode', 'editTag');
      this.set('selectedTag', tag);
      this.set('leftPanel', true);
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
