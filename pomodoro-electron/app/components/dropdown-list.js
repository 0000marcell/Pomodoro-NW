import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown-list'],
  classNameBindings: ['dropdownListShow'],
  didReceiveAttrs(){
    this.set('selectedItem',
      this.get('items')[0]);
    this.set('selection', 
      this.get('items').filter((item) => {
        return item.id !== this.get('items')[0].id;  
      }));
  },
  actions: {
    clickSelected(){
      this.set('dropdownListShow', true); 
    },
    selectItem(item){
      this.set('dropdownListShow', false);
      this.set('selection', 
        this.get('items').filter((val) => {
          return item.id !== val.id;
        }));
      this.set('selectedItem', item);
    }
  }

});
