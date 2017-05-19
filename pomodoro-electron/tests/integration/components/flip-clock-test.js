import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flip-clock', 'Integration | Component | flip clock', {
  integration: true
});

test('#flip-clock-01 it renders a clock', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  let clock = {state: 'paused', mode: 'pomodoro'};
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  assert.equal(this.$('.flip-clock').length, 1);
});

test('#flip-clock-02 it shows the correct time', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 15
  };
  this.set('clock', clock);
  this.set('flipClock', null);
  this.render(hbs`{{flip-clock 
    flipClock=flipClock
    clock=clock}}`);
  assert.equal(this.get('flipClock').getTime().time, 
      14);
});

test('#flip-clock-03 it starts the clock', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 5
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  assert.equal(this.$('.flip-clock').length, 1);
});

test('#flip-clock-03 it stops the clock', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 5
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  Ember.run.later(this, () => {
    this.$('#fc-test-stopbtn').click();
    assert.equal(this.$('.flip-clock').length, 1);
  }, 2000);
});

test('#flip-clock-04 goes to interval mode', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 1,
    shortInterval: 5
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  Ember.run.later(this, () => {
    assert.equal(this.get('clock.mode'), 
      'interval');
  }, 2000);
});

test('#flip-clock-05 comes out of interval mode', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 1,
    shortInterval: 1
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  Ember.run.later(this, () => {
    assert.equal(this.get('clock.mode'), 
      'pomodoro');
  }, 2000);
});
