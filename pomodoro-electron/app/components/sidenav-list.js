import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidenav-list'],
  didInsertElement(){
    let listMode = this.get('listMode');
    this.set('filteredList', 
      this.get(`model.storage.${this.get('listMode')}`)); 
  },
  loading: false,
  searchResults: Ember.observer('search', function(){
    this.set('loading', true);
    Ember.run.later(this, () => {
      let regex = 
        new RegExp(this.get('search'), 'i');
      let result = 
        this.get('model').filter((item) => {
          return item.name.match(regex); 
        });
      this.set('filteredList', result);
      this.set('loading', false);
    }, 500);
  }),
  actions: {
    toggle(item, event){
      let el = Ember.$(event.target)
        .closest("li");
      el.addClass('active');
      if(this.get('prevItem')){
        this.get('prevItem')
          .removeClass('active');  
      }
      this.set('prevItem', el);
      this.set('state.selectedItem', 
          item);
    },
    showLeftPanel(){
      this.set('showLeftPanel', true);
      if(item){
        this.get('model.state.selectedItem', 
          item);
      }else{
        this.get('model.state.selectedItem', 
          null);
      }
    },
    changeListMode(mode){
      this.set('listMode', mode);
    }
  }
});
