import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('task-form', 'Integration | Component | task form', {
  integration: true
});

const baseModel = {tasks: [{id: 1, name: 'Task 1', 
  description: 'Task 2', pomodoros: []}, {id: 2, 
    name: 'Task 2', description: 'Task 2', pomodoros: []}], 
  tags: [{id: 1, name: 'learning', 
    description: 'learning', color: '#fff000'}, 
    {id: 2, name: 'work', description: 'work', color: '#ff00ff'}]};

test('#task-form-01 it shows task form with a select of tags', 
  function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('model', JSON.parse(JSON.stringify(baseModel)));
  this.render(hbs`{{task-form tags=model.tags}}`);
  assert.equal(this.$('#taf-test-tagsList option').length, 
    2);
});

test('#task-form-02 it create a task shows a msg', 
  function(assert){
  this.set('newTask', {name: 'Task 2', 
    description: 'Task 2', pomodoros: []});
  this.set('saveAction', (newTask) => {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if(newTask.name && newTask.description){
        resolve();
      }else{
        reject();
      }
    });
  });
  this.render(hbs`{{task-form  
    task=newTask
    saveTask=saveAction}}`);
  this.$('#taf-test-saveButton').click();
  assert.equal(this.$('#taf-test-msgs li').length, 1);
});

test('#task-form-03 dont create a task show error msg', 
  function(assert){
  this.set('newTask', {name: 'Task 3', 
    description: null, pomodoros: []});
  this.set('saveAction', (newTask) => {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if(newTask.name && newTask.description){
        resolve();
      }else{
        reject();
      }
    });
  });
  this.render(hbs`{{task-form  
    task=newTask
    saveTask=saveAction}}`);
  this.$('#taf-test-saveButton').click();
  assert.equal(this.$('#taf-test-msgs li').length, 1); 
});
