App.Clock = Ember.Object.extend({
  previousState: false,
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(pomodoroTime);
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  start(){
    if(this.get('previousState') === 'interval'){
      this.modeInterval();
      this.set('previousState', false);
    }else{
      this.modeActive();
    }
    this.get('flipClock').start();
  },
  modeActive(){
    this.set('state', 'active');
    $('#task-status')
      .html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');
  },
  modeInterval(){
    this.set('state', 'interval');
    $('#task-status')
      .html('<h4 class="clock-interval animated infinite pulse">[Interval]</h4>');  
  },
  pause(){
    if(this.get('state') !== 'paused'){
      this.set('previousState', this.get('state'));
    }
    this.set('state', 'paused');
    $('#task-status')
      .html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
    this.get('flipClock').stop();
  }
});

const clock = App.Clock.create();
