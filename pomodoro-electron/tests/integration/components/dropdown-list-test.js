import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dropdown-list', 'Integration | Component | dropdown list', {
  integration: true
});

test('#dropdown-list-01 shows a list of items', 
  function(assert) {
  this.set('items', [{id: 1, name: 'pink', value: '#ff00ff'},
    {id: 2, name: 'red', value: '#ff0000'}])
  this.render(hbs`
    {{#dropdown-list items=items as |color|}}
      <p>{{item.name}}</p>
    {{/dropdown-list}}`);
  assert.equal(this.$('#dl-test-list li').length, 
      1);
});
