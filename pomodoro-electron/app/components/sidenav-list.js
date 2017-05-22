import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidenav-list'],
  didReceiveAttrs(){
    this.set('filteredList', 
      this.get(`model.storage.${this.get('listMode')}`)); 
  },
  loading: false,
  actions: {
    searchList(){
      this.set('loading', true);
      Ember.run.later(this, () => {
        let regex = 
          new RegExp(this.get('search'), 'i');
        let model = 
          this.get(`model.storage.${this.get('listMode')}`)
        console.log('model', model);
        let result = 
          model.filter((item) => {
            return item.name.match(regex); 
          });
        this.set('filteredList', result);
        this.set('loading', false);
      }, 500);     
    },
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
    showLeftPanel(item){
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
