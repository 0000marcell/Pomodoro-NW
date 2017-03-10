App.Clock = Ember.Object.extend({
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(pomodoroTime);
  },
  stop(){
    this.set('pause', true);
    this.get('flipClock').stop();
  },
  start(){
    pause = false;
    clock.start();
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
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

const clock = App.Clock.create();
