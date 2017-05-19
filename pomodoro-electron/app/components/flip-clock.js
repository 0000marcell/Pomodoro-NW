import Ember from 'ember';

let pomodoroTime = 5,
    longIntervalTime = 10,
    shortIntervalTime = 5;

export default Ember.Component.extend({
  classNames: ['flip-clock'],
  previousState: false,
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
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(this.get('clock.time'));
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  pause(){
    this.set('clock.state', 'paused');
    this.get('flipClock').stop();
  },
  start(){
    this.set('clock.state', 'active');
    this.get('flipClock').start();
  },
  stopClock(){
    Ember.run.later(this, () => {
      if(this.get('clock.state') === 'paused'){
        return;
      }
      if(this.get('clock.mode') === 'pomodoro'){
        this.incrementProperty('intervalCount');
        let interval = ((this.get('intervalCount') % 3) === 0) ? 
                          longIntervalTime : 
                          shortIntervalTime;
        this.get('flipClock').setTime(interval);
        this.set('clock.mode', 'interval');
      }else if(this.get('clock.mode') === 'interval'){
        this.get('flipClock').setTime(pomodoroTime);   
        this.set('clock.mode', 'pomodoro');
      }
      Ember.run.later(this, () => {
        this.start();
      }, 1000);
    }, 1000);
  },
  actions: {
    playPause(){
      (this.get('active')) ? this.pause() : 
        this.start();
      this.toggleProperty('active');
    }
  }
});
