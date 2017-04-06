var fs = require('fs');

let file = JSON.parse(fs.readFileSync('./data.json'));
let otasks = {"tasks": []};
file.tasks.forEach((task) => {
  let otask = {"id":task.id,"name":task.name,"creation_date": transformDate(task.creation_date),
    "last_active":transformDate(task.last_active),
    "duration":"25:00","pomodoros": [], "duration": null, 
    "totalTime": null};
  let opomodoros = [];
  for(let pomodoro of task.pomodoros){
    opomodoros
      .push(transformDate(pomodoro.date)); 
  }
  otask.pomodoros = opomodoros;
  otasks.tasks.push(otask);
});

console.log('otasks: ', otasks);

function transformDate(string){
  if(!string){
    return;
  }
  console.log('string: ', string);
  let result = string.split('|'),
        hours = result[1],
        minutes = result[2],
        seconds = result[3],
        dates = result[0].split('/'),
        nDate = `${dates[1]}/${dates[0]}/${dates[2]}`;
  console.log('nDate: ', nDate);
  let date = new Date(nDate);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}
