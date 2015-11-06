var fs = require("fs");

function JSONIO(){
	this.file;
}

JSONIO.prototype.read = function(){
	var content;
	try{
		content = fs.readFileSync(this.file);
		if (content == 'undefined'){
			content = fs.readFileSync("back.json");
		}
		var obj = JSON.parse(content);
		return obj;
	}catch(err){
		console.log('An Error occured when trying to read the file '+this.file);
	}
};

JSONIO.prototype.setFile = function(fileName){
	this.file = fileName;	
};

JSONIO.prototype.save = function(json){	
	fs.writeFile(this.file, json, function (err) {
	  if (err){
	   throw err;
	  };
	  console.log('It\'s saved!');
	});	
}

JSONIO.prototype.copy = function(source, dest){
	fs.createReadStream(source).pipe(fs.createWriteStream(dest));
	alert('file was copied!');	
}