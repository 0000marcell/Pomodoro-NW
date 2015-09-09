var gui = require('nw.gui');
var win = gui.Window.get();

function WindowFunctions(){
  this.win = gui.Window.get(); 
};

WindowFunctions.prototype.resize = function(width, height){
  this.win.width = width;
  this.win.height = height;  
};

WindowFunctions.prototype.getWidth = function(){
  return this.win.width;
};

WindowFunctions.prototype.getHeight = function(){
  return this.win.height; 
};
