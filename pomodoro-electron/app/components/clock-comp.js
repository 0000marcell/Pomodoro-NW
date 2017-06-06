import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['clock-comp', 'column'],
  active: false,
  min: '00',
  sec: '00',
  didReceiveAttrs(){
    let clock = this.get('clock');
    this.setTime(clock.time);
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
