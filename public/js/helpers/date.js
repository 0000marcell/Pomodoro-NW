Date.prototype.getDateString = function(){
  var S = this.getSeconds(),
      M = this.getMinutes(), H = this.getHours(),
      dd = this.getDate(), mm = this.getMonth()+1, 
      yyyy = this.getFullYear();
  if(dd<10){
    dd ='0'+dd
  }
  if(mm<10) {
    mm ='0'+mm
  }
  date = dd+'/'+mm+'/'+yyyy+'|'+H+'|'+M+'|'+S;
  return date;
}