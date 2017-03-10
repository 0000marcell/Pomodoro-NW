App.FileIO = Ember.Object.extend({
  read(){
    let content;
    try{
      content = fs.readFileSync(this.get('file'));
      if (content == 'undefined'){
        content = fs.readFileSync("back.json");
      }
      return JSON.parse(content);
    }catch(err){
      console.log('An Error occured when trying to read the file '+this.get('file'));
    }
  },
  save(json){	
    fs.writeFile(this.get('file'), json, function (err) {
      if (err){
       throw err;
      };
      console.log('File was saved!');
    });	
  },
  copy(source, dest){
    fs.createReadStream(source).pipe(fs.createWriteStream(dest));
    alert('file was copy!');	
  }
});

const fileIO = App.FileIO.create();
