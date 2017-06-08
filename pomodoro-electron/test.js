let clock = {
  callLocal(){
    console.log(`the value is ${this.localValue}`);
  } 
};

let clockContainer = {
  init(clock){
    this.callLocal = clock.callLocal.bind(this);
  },
  call(){
    this.localValue = 'local';
    this.callLocal();
  }
}

clockContainer.init(clock);
clockContainer.call();
