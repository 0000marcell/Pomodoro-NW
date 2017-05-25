import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('color-option', 'Integration | Component | color option', {
  integration: true
});

test('#color-option-01 it show a clock with the color passed', 
  function(assert) {

  this.set('color', {id: 1, value: '#ff00ff'});
  this.render(hbs`{{color-option color=color}}`);
  let result = 
      this.$('#co-test-block').css('background-color');
  assert.equal(result, 'rgb(255, 0, 255)');
});
