var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    console.log("init is running mother fucker!");
    //init data
    var json = {
        'label': ['label A', 'label B'],
        'values': [
        {
          'label': 'date A',
          'values': [80]
        }, 
        {
          'label': 'date B',
          'values': [0, 20]
        }]
    };
    //end
    //init PieChart
    var pieChart = new $jit.PieChart({
      //id of the visualization container
      injectInto: 'infovis',
      //whether to add animations
      animate: true,
      //offsets
      offset: 30,
      sliceOffset: 0,
      labelOffset: 20,
      //slice style
      type: useGradients? 'stacked:gradient' : 'stacked',
      //whether to show the labels for the slices
      showLabels:true,
      //resize labels according to
      //pie slices values set 7px as
      //min label size
      resizeLabels: 7,
      //label styling
      Label: {
        type: labelType, //Native or HTML
        size: 20,
        family: 'Arial',
        color: 'white'
      },
      //enable tips
      Tips: {
        enable: true,
        onShow: function(tip, elem) {
           tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
        }
      }
    });
    //load JSON data.
    pieChart.loadJSON(json);
}
