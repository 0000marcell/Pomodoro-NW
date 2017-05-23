import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tag-form', 
  'Integration | Component | tag form', {
  integration: true
});

const newTag = {name: 'work', description: 'work',
  color: '#ff00ff'};

const baseModel = {tasks: [], tags: [{id: 1, name: 'learning', 
  description: 'learning', color: '#fff000'}]};

test('#tag-form-01 it creates a tag, shows a msg', 
  function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('newTag', JSON.parse(JSON.stringify(newTag)));
  this.set('model', JSON.parse(JSON.stringify(baseModel)))
  this.render(hbs`{{tag-form model=model newTag=newTag}}`);
  this.$('#tf-test-addButton').click();
  assert.equal(this.get('model.tags.length'), 2);
  assert.equal(this.$('#tf-test-msg').text.trim(), 
    'tag created!');
});

test('#tag-form-02 it shows error msg', function(assert){
  this.set('newTag', {name: '', 
    description: '', color: ''});
  this.set('msgs', []);
  this.set('model', JSON.parse(JSON.stringify(baseModel)))
  this.render(hbs`{{tag-form 
    msgs=msgs
    model=model newTag=newTag}}`);
  this.$('#tf-test-addButton').click();
  assert.ok(this.$('#tf-test-msg').length);
  assert.equal(this.get('msgs').length, 3);
});
