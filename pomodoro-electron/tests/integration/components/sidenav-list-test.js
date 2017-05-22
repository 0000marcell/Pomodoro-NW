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

test('#sidenav-list-01 shows a list of tasks', 
  function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  let data = JSON.parse(JSON.stringify(baseObj));
  this.set('model', data);
  this.set('listMode', 'tasks');
  this.render(hbs`{{sidenav-list 
    listMode=listMode
    model=model}}`);
  assert.equal(this.$('li').length, 2);
});

test('#sidenav-list-02 shows a list of tags', function(assert){
  let data = JSON.parse(JSON.stringify(baseObj));
  this.set('model', data);
  this.set('listMode', 'tags');
  this.render(hbs`{{sidenav-list 
    listMode=listMode
    model=model}}`);
  assert.equal(this.$('li').length, 2);
});

test('#sidenav-list-03 searchs the list', function(assert){
  let data = JSON.parse(JSON.stringify(baseObj));
  this.set('model', data);
  this.set('listMode', 'tags');
  this.render(hbs`{{sidenav-list 
    listMode=listMode
    model=model}}`);
  this.$('#sl-test-search').val('learning')
  return new Ember.RSVP.Promise((resolve) => {
    const wait = setInterval(() => {
      assert.equal(this.$('li').length, 1);
      clearInterval(wait);
      resolve();
    }, 3000); 
  });
});
