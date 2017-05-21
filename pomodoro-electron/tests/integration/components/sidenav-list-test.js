import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidenav-list', 'Integration | Component | sidenav list', {
  integration: true
});

let baseObj = {
  storage: {
  tasks: [{id: 1, name: 'task 1', 
    description: 'description 1', pomodoros: []},
    {id: 2, name: 'task 2', description: 'description 2', 
      pomodoros: []}], 
  tags: [{id: 1, name: 'work', 
    description: 'work!', color: '#ff00ff'},
    {id: 2, name: 'learning', description: 'learning!',
      color: '#fff00'}]}
};  

test('#sidenav-list-01 shows a list of items', 
  function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  let data = JSON.parse(JSON.stringify(baseObj));
  this.set('model', data);
  this.set('listMode', 'tasks');
  this.render(hbs`{{sidenav-list model=model}}`);
  assert.equal(this.$('li').length, 2);
});
