import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown-list'],
  classNameBindings: ['dropdownListShow'],
  didReceiveAttrs(){
    if(this.get('items')){
      this.set('selectedItem',
        this.get('items').objectAt(0));
      this.set('selection', 
        this.get('items').filter((item) => {
          return item.id !== this.get('items').objectAt(0).id;  
        }));
    }
  },
  actions: {
    clickSelected(){
      this.toggleProperty('dropdownListShow');
    },
    selectItem(item){
      this.set('dropdownListShow', false);
      this.set('selection', 
        this.get('items').filter((val) => {
          return item.id !== val.id;
        }));
      this.set('selectedItem', item);
      this.set('selected', item);
    }
  }

});
