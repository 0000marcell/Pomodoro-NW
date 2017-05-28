import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['color-option'],
  didReceiveAttrs(){
    let value = this.get('color.value');
    this.set('style', 
      Ember.String.htmlSafe(`background-color: ${value}`));
  }
});
