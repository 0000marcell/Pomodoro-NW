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
  saveTasks(tasks){
    tasks = tasks.toArray().map((task, index) => {
      let json = task.toJSON(); 
      json['id'] = index + 1;
      return json;
    });
    this.save(`{"tasks": ${JSON.stringify(tasks)}}`,
        mainDataPath);
  },
  copy(source, dest){
    fs.createReadStream(source).pipe(fs.createWriteStream(dest));
    alert('file was copy!');	
  }
});

const fileIO = App.FileIO.create();
