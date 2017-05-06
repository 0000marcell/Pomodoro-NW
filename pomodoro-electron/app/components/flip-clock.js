import Ember from 'ember';

export default Ember.Component.extend({
  previousState: false,
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(25 * 60);
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  modeActive(){
    this.set('state', 'active');
    Ember.$('#task-status')
      .html(`<h4 class="clock-active animated infinite pulse">
        [Active]</h4>`);
  },
  modeInterval(){
    this.set('state', 'interval');
    Ember.$('#task-status')
      .html(`<h4 class="clock-interval animated infinite pulse">
        [Interval]</h4>`);  
  },
  pause(){
    if(this.get('state') !== 'paused'){
      this.set('previousState', this.get('state'));
    }
    this.set('state', 'paused');
    Ember.$('#task-status')
      .html(`<h4 class="clock-paused animated infinite flash">
          [Paused]</h4>`);
    this.get('flipClock').stop();
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
  didInsertElement(){
    let flipClock = Ember.$('.clock').FlipClock({
      thisFace: 'MinuteCounter',
      autoStart: false,
      callbacks: {
        stop: this.stopClock.bind(this)
      }
    }); 
    this.set('flipClock', flipClock);
    this.initialize();
  },
  stopClock(){
    /* 
     * verifies if the this was stoped because it reached zero
     * or because the user stoped it
    */
    if(this.get('state') === 'paused'){
      return;
    }else if (this.get('state') === 'interval'){
      this.reset(pomodoroTime);
      this.modeActive();
      this.start();
    } else {
      this.set('intervalCount', 
        this.get('intervalCount') + 1);
      this.savePomodoro(this.get('selectedTask'));
      win.focus();
      let interval = ((this.get('intervalCount') % 3) == 0) ? longIntervalTime : 
                                                              shortIntervalTime;
      this.reset(interval);
      this.start();
      this.modeInterval();
    } 
  },
  actions: {
    start(){
      this.toggleProperty('active');
      this.start();
    }
  }
});
