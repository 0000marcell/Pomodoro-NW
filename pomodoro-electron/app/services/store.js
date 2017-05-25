import Ember from 'ember';

export default Ember.Service.extend({
  persist(){
    return new Ember.RSVP.Promise((resolve, reject) => {
      // todo persist the values 
      console.log('persist!');
      resolve(); 
    });
  }
});
