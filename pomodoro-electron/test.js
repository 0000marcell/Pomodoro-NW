let data = {
  task: [
    {name: 'task 1', description: 'task 2', active: true}
  ],
  tag: [
    {name: 'tag 1', description: 'tag 2', color: '#ff00ff'}
  ],
  color: [
    {name: '', value: '#ff00ff'}
  ],
  pomodoro: [
    {date: new Date(), task: 1}
  ]
}

for(let key in data){
  for(let val of data[key]){
    console.log(val);
  }
}
