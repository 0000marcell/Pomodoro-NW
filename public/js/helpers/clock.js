App.Clock = Ember.Object.extend({
  initialize(){
    this.get('flipClock').setCountdown(true);
    this.get('flipClock').setTime(pomodoroTime);
  },
  reset(sec){
    this.get('flipClock').setTime(sec)
  },
  activate(){
    this.set('state', 'active');
    $('#task-status')
      .html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');
    this.get('flipClock').start();
  },
  pause(){
    this.set('state', 'paused');
    $('#task-status')
      .html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
    this.get('flipClock').stop();
  },
  interval(){
    $('#task-status')
      .html('<h4 class="clock-interval animated infinite pulse">[Interval]</h4>');  
  }
});

const clock = App.Clock.create();
