App.FileIO = Ember.Object.extend({
  read(path){
    let content;
    try{
      content = fs.readFileSync(path);
      if (content == 'undefined'){
        content = fs.readFileSync("back.json");
      }
      return JSON.parse(content);
    }catch(err){
      console.log('An Error occured when trying to read the file '+path);
    }
  },
  save(json, path){	
    fs.writeFile(path, json, function (err) {
      if (err){
       throw err;
      };
      console.log('File was saved!');
    });	
  },
  uploadAWS(content){
    var params = {Key: 'new.json', Body: content};
    bucket.upload(params, (error, data) => {
      if(error){
        alert("File sync failed "+error);
      }
    });
  },
  saveTasks(tasks){
    tasks.lastUpdate = new Date();
    let content = JSON.stringify(tasks);
    if(awsUseStorage){
      this.uploadAWS(content); 
    }
    this.save(content,
        mainDataPath);
  },
  copy(source, dest){
    fs.createReadStream(source).pipe(fs.createWriteStream(dest));
    alert('file was copy!');	
  }
});

const fileIO = App.FileIO.create();
