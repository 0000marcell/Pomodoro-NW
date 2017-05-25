import Ember from 'ember';

const links = [{icon: 'clock-o', name: 'schedule', link: 'schedule'},
               {icon: 'bar-chart', name: 'statistics', link: 'statistics'},
               {icon: 'cog', name: 'configuration', link: 'configuration'}]

export default Ember.Controller.extend({
  openSidenav: false,
  links: links,
  clock: {
    state: 'paused',
    mode: 'pomodoro'
  },
  savePomodoro: Ember.computed('clock', function(){
    if(this.get('clock.mode') === 'interval'){
      alert('save pomodoro!');
    }    
  }),
  actions: {
    showSidenav(){
      this.toggleProperty('openSidenav');
    }
  }
});
