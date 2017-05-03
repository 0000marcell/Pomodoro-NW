App.resetFixtures = function() {
  fileIO.set('file', mainDataPath);
  App.Task.FIXTURES = $.map(fileIO.read(), 
                    function(el) { return el; }); 
  var params = {Key: 'data.json'};
  if(awsUseStorage){
    bucket.getObject(params, function(error, data) {
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
