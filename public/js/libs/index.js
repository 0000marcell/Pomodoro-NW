// var gui = require('nw.gui'); 
// var taskWindow;

var startFn = function(){
	console.log('gonna start the clock!!!');
  pomodoroClock.start();
};

var stopFn = function(){
  pomodoroClock.stop();
};

// var newTaskFn = function(){
// 	taskWindow = gui.Window.get(
//   	window.open('newtask.html')
// 	);
// };

$(function() {
    $('#startButton').click(startFn);
    $('#stopButton').click(stopFn);
    // $('#newTask').click(newTaskFn);
});



