App.Task = DS.Model.extend(Ember.Validations.Mixin, {
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

  validations: {
    name: {
      presence: true
    }
  },
  durations: ['55:00','1:00', '50:00','45:00'
               ,'40:00','35:00','30:00','25:00','20:00'],

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
  saveOnFile: function(){
    this.generateJSON();
    
  },
  generateJSON: function(){
    var json = {tasks : []},
    _this = this;
    i = 0;
    this.store.find('task').then(function(tasks){
      tasks.forEach(function(task){
        _this.createPomodoroArrayIfUnd(task);
        json.tasks.push(
                   _this.createJsonString(task, i++));
      });
    }).then(function(){
      var content = JSON.stringify(json);
      jsonio.save(content);
      if(awsUseStorage){
        _this.uploadToAWS(content);
      }
    });
  },
  uploadToAWS: function(content){
    var params = {Key: 'data.json', Body: content};
    bucket.upload(params, function (error, data) {
      if(error){
        alert("File sync failed "+error);
      }
    });
  },
  createPomodoroArrayIfUnd: function(task){
   if(task.get("pomodoros") == undefined){
    var pomodoroArray = []; 
    task.set('pomodoros', pomodoroArray);
   }
  },
  createJsonString: function(task, index){
    var tmp = {id: index,
        name: task.get("name"),
        creation_date: task.get('creation_date'),
        last_active: task.get('last_active'),
        duration: task.get("duration"),
        pomodoros: task.get("pomodoros")};
    return tmp
  },
  formatDates: function(){
    this.set('formated_creation_date', this.formatDate('creation_date'));
    this.set('formated_last_active', this.formatDate('last_active'));
  },
  formatDate: function(unformatedDate){
    var arr = this.get('creation_date').split('|'),
        date = arr[0];
    return arr[0]+' '+arr[1]+'h'+arr[2]+'m';
  }
});

App.resetFixtures = function() {
  jsonio.setFile(mainDataPath);
  App.Task.FIXTURES = $.map(jsonio.read(), 
                    function(el) { return el; }); 
  var params = {Key: 'data.json'};
  bucket.getObject(params, function(error, data) {
    if (error) {
      alert("File sync failed : "+error);
    } else {
      var attachment = data.Body.toString();
      App.Task.FIXTURES = $.map(JSON.parse(attachment), 
                    function(el) { return el; }); 
    }
  });
};



App.resetFixtures();
