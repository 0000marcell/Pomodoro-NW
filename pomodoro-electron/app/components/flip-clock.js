import Ember from 'ember';

let pomodoroTime = 5,
    longIntervalTime = 10,
    shortIntervalTime = 5;

export default Ember.Component.extend({
  previousState: false,
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(pomodoroTime);
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  pause(){
    this.set('state', 'paused');
    this.get('flipClock').stop();
  },
  start(){
    this.set('state', 'active');
    this.get('flipClock').start();
  },
  didInsertElement(){
    let flipClock = Ember.$('.clock').FlipClock({
      clockFace: 'MinuteCounter',
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
      this.get('flipClock').setTime(pomodoroTime);
      this.start();
    } else {
      this.set('intervalCount', 
        this.get('intervalCount') + 1);
      win.focus();
      let interval = ((this.get('intervalCount') % 3) == 0) ? longIntervalTime : 
                                                              shortIntervalTime;
      this.get('flipClock').setTime(interval);
      this.start();
    } 
  },
  actions: {
    playPause(){
      (this.get('active')) ? this.pause() : 
        this.start();
      this.toggleProperty('active');
    }
  }
});
