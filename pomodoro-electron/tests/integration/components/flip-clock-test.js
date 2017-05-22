import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

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
  this.set('flipClock', null);
  this.render(hbs`{{flip-clock 
    flipClock=flipClock
    clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  Ember.run(this, () => {
    assert.equal(this.get('flipClock').getTime().time, 
      3);
  });
});

test('#flip-clock-04 it stops the clock', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 5
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  Ember.run(this, () => {
    this.$('#fc-test-startbtn').click();
    Ember.run(this, () => {
      assert.equal(this.get('clock.state'), 'paused');
    });
  });
});

test('#flip-clock-05 goes to interval mode', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 2,
    shortInterval: 5
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  return new Ember.RSVP.Promise((resolve, reject) => {
    const wait = setInterval(() => {
      assert.equal(this.get('clock.mode'), 
        'interval'); 
      this.$('#fc-test-startbtn').click();
      clearInterval(wait);
      resolve();
    }, 3000);  
  });
});

test('#flip-clock-06 comes out of interval mode', 
  function(assert){
  let clock = {
    state: 'paused', 
    mode: 'pomodoro',
    time: 2,
    shortInterval: 2
  };
  this.set('clock', clock);
  this.render(hbs`{{flip-clock clock=clock}}`);
  this.$('#fc-test-startbtn').click();
  return new Ember.RSVP.Promise((resolve) => {
    const wait = setInterval(() => {
      assert.equal(this.get('clock.mode'), 
        'interval'); 
      this.$('#fc-test-startbtn').click();
      clearInterval(wait);
      resolve();
    }, 4000);  
  });
});
