import Ember from 'ember';

export default Ember.Component.extend({
  min: '00',
  sec: '00',
  didReceiveAttrs(){
    let clock = this.get('clock');
    this.setClock(clock.time);
  },
  setWithPad(att, val){
    if(val < 10){
      this.set(attr, `0${val}`);
    }else{
      this.set(attr, val);
    }
  },
  setClock(time){
    if(time > 60){
      let min = Math.floor(time/60);
      this.setWithPad('min', min);
      let sec = time%60;
      this.setWithPad('sec', sec);
    }else{
      this.setWithPad('sec', time);
    }
  },
  start(){
    Ember.run.later(this, () => {
      this.decreaseTime();
    }, 1000);
  },
  decreaseTime(){
    let min = parseInt(this.get('min'));
    let sec = parseInt(this.get('sec'));
  }
});
