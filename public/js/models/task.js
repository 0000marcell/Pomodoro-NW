App.Task = DS.Model.extend({
  name: DS.attr('string'),
  creation_date: DS.attr('string'),
  formated_creation_date: DS.attr('string'),
  last_active: DS.attr('string'),
  formated_last_active: DS.attr('string'),
  pomodoros: DS.attr('array'),
  duration: DS.attr('string'),
  totalTime: DS.attr('string'),
  saveOnFile(){
    let tasks = this.store.all('task');
    tasks = tasks.toArray().map((task, index) => {
      let json = task.toJSON(); 
      json['id'] = index + 1;
      return json;
    });
    fileIO.save(`{"tasks": ${JSON.stringify(tasks)}}`,
        mainDataPath);
  },
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
  uploadToAWS(content){
    var params = {Key: 'data.json', Body: content};
    bucket.upload(params, (error, data) => {
      if(error){
        alert("File sync failed "+error);
      }
    });
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
