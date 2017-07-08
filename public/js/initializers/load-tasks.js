App.resetFixtures = function() {
  if(environment === 'test'){
    App.Task.FIXTURES = createTasks(10, 10);
  }else{
    fileIO.set('file', mainDataPath);
    App.Task.FIXTURES = $.map(fileIO.read(), 
                    function(el) { return el; }); 
  }
  if(awsUseStorage){
    bucket.getObject({Key: 'data.json'}, function(error, data) {
      if (error) {
        alert("File sync failed : "+error);
      } else {
        var attachment = data.Body.toString();
        App.Task.FIXTURES = $.map(JSON.parse(attachment), 
                      function(el) { return el; }); 
      }
    });
  }
};

App.resetFixtures();
