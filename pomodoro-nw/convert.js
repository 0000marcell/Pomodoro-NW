var fs = require('fs');
var n = 0;

let file = JSON.parse(fs.readFileSync('./data.json'));
let otasks = {"tasks": []};
file.tasks.forEach((task) => {
  let otask = {"id":task.id,"name":task.name,"creation_date": transformDate(task.creation_date),
    "last_active":transformDate(task.last_active),
    "duration":"25:00","pomodoros": [], "duration": task.duration};
  let opomodoros = [];
  for(let pomodoro of task.pomodoros){
    opomodoros
      .push({"date": transformDate(pomodoro.date)}); 
  }
  otask.pomodoros = opomodoros;
  otasks.tasks.push(otask);
});

fs.writeFileSync('./new.json', JSON.stringify(otasks));

function transformDate(string){
  n = n + 1;
  if(!string){
    return;
  }
  let result = string.split('|'),
        hours = result[1],
        minutes = result[2],
        seconds = result[3],
        dates = result[0].split('/'),
        nDate = `${dates[1]}/${dates[0]}/${dates[2]}`;
  let d = new Date(nDate);
  if (Object.prototype.toString.call(d) === "[object Date]"  ) {
    // it is a date
    if ( isNaN( d.getTime()  )  ) {  // d.valueOf() could also work
      console.log(`${nDate} is not a VALID`);
      return;
    }
  }else{
    console.log(`${nDate} is not a date`);
  }
  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(seconds);
  return d;
}
