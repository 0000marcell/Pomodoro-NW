import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sidenav-panel', 'Integration | Component | sidenav panel', {
  integration: true
});

test('#sidenav-panel-01 it opens the panel', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('openSidenav', true);
  this.render(hbs`{{sidenav-panel 
    openSidenav=openSidenav}}`);
  assert.equal(this.$('.open-sidenav').length , 1);
});

test('#sidenav-panel-02 opens left panel', function(assert){
  this.set('leftPanel', true);
  this.render(hbs`{{sidenav-panel 
    leftPanel=leftPanel}}`);
  assert.equal(this.$('.left-panel').length , 1);
});

test('#sidenav-panel-03 closes the panel on overlay click', 
  function(assert){
  this.set('leftPanel', true); 
  this.set('openSidenav', true);
  this.render(hbs`{{sidenav-panel 
    leftPanel=leftPanel
    openSidenav=openSidenav
    }}`);
  this.$('#sp-test-overlaybtn').click();
  assert.equal(this.$('.open-sidenav').length , 0);
  assert.equal(this.$('.left-panel').length , 0);
});
