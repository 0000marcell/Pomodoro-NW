function ClockState(){
  this.currentState; 
  this.previousState;
}

ClockState.prototype.activate = function(){
  if(this.previousState == 'interval'){
    this.interval();
  }else{
    $('#task-status').html('<h4 class="clock-active animated infinite pulse">[Active]</h4>');  
    this.currentState = 'active'
  }
}

ClockState.prototype.pause = function(){
  this.previousState = this.currentState;
  $('#task-status').html('<h4 class="clock-paused animated infinite flash">[Paused]</h4>');
  this.currentState = 'pause';
}

ClockState.prototype.interval = function(){
  $('#task-status').html('<h4 class="clock-interval animated infinite pulse">[Interval]</h4>');  
  this.currentState = 'interval';
}