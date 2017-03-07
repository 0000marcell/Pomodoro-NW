App.Clock = Ember.Object.extend({
  currentState: null,
  previousState: null,
  activate(){
    if(this.get('previousState') == 'interval'){
      this.interval();
    }else{
      $('#task-status').html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');  
      this.set('currentState', 'active');
    }
  },
  reactivate(){
    $('#task-status').html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');  
    this.set('currentState', 'active')
  },
  pause(){
    this.set('previousState', this.get('currentState'));
    $('#task-status').html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
    this.set('currentState', 'pause');
  },
  interval(){
    $('#task-status').html('<h4 class="clock-interval animated infinite pulse">[Interval]</h4>');  
    this.set('currentState', 'interval');
  }
});
