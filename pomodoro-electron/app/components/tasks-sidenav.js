import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.set('filteredTasks', this.get('tasks'));
  },
  loading: false,
  searchResults: Ember.observer('search', function(){
    this.set('loading', true);
    Ember.run.later(this, () => {
      let regex = 
        new RegExp(this.get('search'), 'i');
      let result = this.get('tasks').filter((item) => {
        console.log('item name: ', item.name);
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
    toggle(event){
      event.target
        .classList.add('active');
      if(this.get('prevItem')){
        this.get('prevItem')
          .classList.remove('active');  
      }
      this.set('prevItem', event.target);
    }
  }
});
