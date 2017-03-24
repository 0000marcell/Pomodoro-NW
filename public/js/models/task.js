App.Task = DS.Model.extend({
  name: DS.attr('string'),
  creation_date: DS.attr('string'),
  formated_creation_date: DS.attr('string'),
  last_active: DS.attr('string'),
  formated_last_active: DS.attr('string'),
  pomodoros: DS.attr('array'),
  duration: DS.attr('string'),
  totalTime: DS.attr('string'),
  htmlID: function() {
    return 'task' + this.get('id');
  }.property('id'),
  setTotalTime: function(){
    this.set('totalTime', this.calculateTotalTime());   
  },
  calculateTotalTime: function(){
    var length = parseInt(this.get('pomodoros').length),
        duration = parseInt(this.get('duration')),
        totalTimeInMin = length * duration,
        hours = Math.floor(totalTimeInMin/60),
        min = totalTimeInMin % 60;
    return hours+'h'+min+'m'
  },
  saveOnFile(){
    this.generateJSON();
  },
  generateJSON(){
    var json = {tasks : []},
    i = 0;
    this.store.find('task').then((tasks) => {
      tasks.forEach((task) => {
        this.createPomodoroArrayIfUnd(task);
        json.tasks
          .push(this.createJsonString(task, i++));
      });
    }).then(() => {
      var content = JSON.stringify(json);
      fileIO.save(content);
      if(awsUseStorage){
        this.uploadToAWS(content);
      }
    });
  },
  uploadToAWS(content){
    var params = {Key: 'data.json', Body: content};
    bucket.upload(params, (error, data) => {
      if(error){
        alert("File sync failed "+error);
      }
    });
  },
  createPomodoroArrayIfUnd(task){
   if(task.get("pomodoros") == undefined){
    var pomodoroArray = []; 
    task.set('pomodoros', pomodoroArray);
   }
  },
  createJsonString(task, index){
    var tmp = {id: index,
        name: task.get("name"),
        creation_date: task.get('creation_date'),
        last_active: task.get('last_active'),
        duration: task.get("duration"),
        pomodoros: task.get("pomodoros")};
    return tmp
  },
  formatDates(){
    this.set('formated_creation_date', this.formatDate('creation_date'));
    this.set('formated_last_active', this.formatDate('last_active'));
  },
  formatDate(unformatedDate){
    var arr = this.get(unformatedDate).split('|'),
        date = arr[0];
    return arr[0]+' '+arr[1]+'h'+arr[2]+'m';
  }
});
