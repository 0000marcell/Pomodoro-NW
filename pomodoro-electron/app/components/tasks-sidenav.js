import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidenav-panel'],
  didInsertElement(){
    this.set('filteredTasks', this.get('model.tasks'));
  },
  loading: false,
  searchResults: Ember.observer('search', function(){
    this.set('loading', true);
    Ember.run.later(this, () => {
      let regex = 
        new RegExp(this.get('search'), 'i');
      let result = 
        this.get('model.tasks').filter((item) => {
          return item.name.match(regex); 
        });
      this.set('filteredTasks', result);
      this.set('loading', false);
    }, 500);
  }),
  actions: {
    toggle(task, event){
      let el = Ember.$(event.target)
        .closest("li");
      el.addClass('active');
      if(this.get('prevItem')){
        this.get('prevItem')
          .removeClass('active');  
      }
      this.set('prevItem', el);
      this.set('model.state.selectedTask', 
          task);
    },
    showEditTask(task){
      this.get('showEditTask')(task);
    },
    showCreateTask(){
      this.get('showCreateTask')(); 
    },
    showCreateTag(){
      this.get('showCreateTag')(); 
    }
  }
});
