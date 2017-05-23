import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tag-form', 
  'Integration | Component | tag form', {
  integration: true
});

const baseTag = {name: 'work', description: 'work',
  color: '#ff00ff'};

const baseModel = {tasks: [], tags: [{id: 1, name: 'learning', 
  description: 'learning', color: '#fff000'}]};

test('#tag-form-01 it creates a tag, shows a msg', 
  function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('tag', JSON.parse(JSON.stringify(baseTag)));
  this.set('saveTag', (newTag) => {
    assert.deepEqual(newTag, baseTag);
    return new Ember.RSVP.Promise((resolve, reject) => {
      if(newTag.name && newTag.description 
        && newTag.color){
        resolve();
      }else{
        reject();
      }
    });
  });
  this.render(hbs`{{tag-form saveTag=saveTag tag=tag}}`);
  this.$('#tf-test-saveButton').click();
  assert.equal(this.$('#tf-test-msgs').text().trim(), 
      'tag saved!');
});

test('#tag-form-02 it shows an error msg', function(assert){
  this.set('tag', {name: '', description: ''});
  this.set('saveTag', (newTag) => {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if(newTag.name && newTag.description 
        && newTag.color){
        resolve();
      }else{
        reject();
      }
    });
  });
  this.render(hbs`{{tag-form saveTag=saveTag tag=tag}}`);
  this.$('#tf-test-saveButton').click();
  assert.equal(this.$('#tf-test-msgs').text().trim(), 
      'an error occored!');
});
