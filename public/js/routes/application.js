App.ApplicationRoute = Ember.Route.extend({
  beforeModel(){
    if(environment === 'test'){
      store.loadForTests();
    }else{
      if(awsUseStorage){
        store.loadFromAWS(); 
      }else{
        store.loadFromFile();
      }
    }
  },
  model() {
    return store;
  },
  afterModel(){
    this.transitionTo('main');
  }
});
