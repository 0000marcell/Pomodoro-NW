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

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}
