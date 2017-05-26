import Ember from 'ember';

export default Ember.Controller.extend({
  colors: [{id: 1, name: 'pink', value: '#ff00ff'},
    {id: 2, name: 'red', value: '#ff0000'}],
  selected: Ember.observer('selectedItem', function(){
    console.log(this.get('selectedItem'));
  })
});
