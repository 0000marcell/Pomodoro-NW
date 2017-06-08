import Ember from 'ember';

const links = [{icon: 'clock-o', 
  name: 'schedule', link: 'schedule'},
  {icon: 'bar-chart', 
   name: 'statistics', 
   link: 'statistics'},
  {icon: 'cog', 
   name: 'configuration', link: 'configuration'}];

export default Ember.Controller.extend({
  openSidenav: false,
  links: links
});
