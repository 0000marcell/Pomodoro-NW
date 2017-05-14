import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.set('filteredTasks', this.get('model.data.tasks'));
  },
  loading: false,
  searchResults: Ember.observer('search', function(){
    this.set('loading', true);
    Ember.run.later(this, () => {
      let regex = 
        new RegExp(this.get('search'), 'i');
      let result = this.get('model.data.tasks').filter((item) => {
        return item.name.match(regex); 
      });
      this.set('filteredTasks', result);
      this.set('loading', false);
    }, 500);
  }),
  classNameBindings: ['openSidenav'],
  actions: {
    overlayClick(){
      this.toggleProperty('openSidenav');
    },
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
    }
  }
});
