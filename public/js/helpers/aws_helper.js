function read_aws_info(awsConfigPath){
  var content;
  try{
    content = fs.readFileSync(awsConfigPath);
    if (content == 'undefined'){
      alert(" aws config file was empty, plz enter your aws settings");   
    }
    var obj = JSON.parse(content);
    return obj;
  }catch(err){
    alert('An Error occured when trying to read the file '+this.file+" error : "+err);
  }  
}
