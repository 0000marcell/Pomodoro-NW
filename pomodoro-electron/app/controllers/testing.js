import Ember from 'ember';

export default Ember.Controller.extend({
  colors: [{id: 1, name: 'pink', value: '#ff00ff'},
    {id: 2, name: 'red', value: '#ff0000'}],
  actions: {
    confirm(val){
       console.log(val);
    },
    showDialog(){
      this.set('dialogCB', () => {
         console.log('dialog callback!');
      });
      this.toggleProperty('showDialog'); 
    }
  }
});
