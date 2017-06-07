import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['clock-comp', 'column'],
  active: false,
  min: '00',
  sec: '00',
  timeObj: Ember.observer('clock.time', function(){
    console.log('time changed');
  }),
  didReceiveAttrs(){
    let clock = this.get('clock');
    this.set('clock.env', this);
    this.setTime(clock.time);
  },
  start(){
    if(!this.get('timeInt')){
      let timeInt = setInterval(() => {
        this.decreaseTime();
      }, 1000)
      this.set('timeInt', timeInt);
      this.set('clock.pausedByUser', false);
    }
  },
  stop(){
    clearInterval(this.get('timeInt'));
    this.set('timeInt', null);
    if(this.get('stopCB')){
      this.get('stopCB')(this);
    }
  },
  setTime(time){
    if(time > 60){
      let min = Math.floor(time/60);
      this.setWithPad('min', min);
      let sec = time%60;
      this.setWithPad('sec', sec);
    }else{
      this.setWithPad('sec', time);
    }
  },
  setWithPad(attr, val){
    if(val < 10){
      this.set(attr, `0${val}`);
    }else{
      this.set(attr, val);
    }
  },
  
  decreaseTime(){
    let min = parseInt(this.get('min'));
    let sec = parseInt(this.get('sec'));
    sec = sec - 1;
    if(sec < 0){
      min = min - 1;
      if(min < 0){
        this.stop();
      }else{
        this.setWithPad('min', min);
      }
    }else{
      this.setWithPad('sec', sec);   
    }
  },
  actions: {
    playPause(){
      this.get('playPause')(this);
    }
  }
});
