App.Clock = Ember.Object.extend({
  state: 'paused',
  previousState: 'active',
  intervalCount: 0,
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(pomodoroTime);
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  start(){
    let time = this.get('flipClock').time.time,
        prevState = this.get('previousState');
    if(time === 0){
      if(prevState == 'active'){
        this.get('flipClock').setTime(pomodoroTime);   
        this.modeActive();
      }else{
        let interval = 
          ((clock.get('intervalCount') % 3) == 0) ? 
            longIntervalTime : 
            shortIntervalTime;
        this.get('flipClock').setTime(interval);   
        this.modeInterval();
      }
    }
    if(this.get('state') === 'paused'){
      if(prevState == 'active'){
        this.modeActive();
      }else{
        this.modeInterval();
      }
    }else{
      if(prevState === 'active'){
        this.modeInterval();
      }else if(prevState === 'interval'){
        this.modeActive();
      }else{
        this.set('state', this.get('previousState'));
        this.modeActive();
      }
    }
    this.get('flipClock').start();
  },
  modeActive(){
    this.set('state', 'active');
    this.set('previousState', this.get('state'));
    $('#task-status')
      .html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');
  },
  modeInterval(){
    this.set('state', 'interval');
    this.set('previousState', this.get('state'));
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
