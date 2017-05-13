import Ember from 'ember';

export default Ember.Component.extend({
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
