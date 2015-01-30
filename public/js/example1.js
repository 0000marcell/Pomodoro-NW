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


function init(json){
    //Area Chart
    // var areaChart = new $jit.AreaChart({
    //   //id of the visualization container
    //   injectInto: 'infovis',
    //   //add animations
    //   animate: true,
    //   //separation offsets
    //   Margin: {
    //     top: 5,
    //     left: 5,
    //     right: 5,
    //     bottom: 5
    //   },
    //   labelOffset: 10,
    //   //whether to display sums
    //   showAggregates: true,
    //   //whether to display labels at all
    //   showLabels: true,
    //   //could also be 'stacked'
    //   type: useGradients? 'stacked:gradient' : 'stacked',
    //   //label styling
    //   Label: {
    //     type: labelType, //can be 'Native' or 'HTML'
    //     size: 13,
    //     family: 'Arial',
    //     color: 'white'
    //   },
    //   //enable tips
    //   Tips: {
    //     enable: true,
    //     onShow: function(tip, elem) {
    //       tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
    //     }
    //   },
    //   //add left and right click handlers
    //   filterOnClick: true,
    //   restoreOnRightClick:true
    // });
    // areaChart.loadJSON(json);

    //Pie Chart
    // var pieChart = new $jit.PieChart({
    //   //id of the visualization container
    //   injectInto: 'infovis',
    //   //whether to add animations
    //   animate: true,
    //   //offsets
    //   offset: 30,
    //   sliceOffset: 0,
    //   labelOffset: 20,
    //   //slice style
    //   type: useGradients? 'stacked:gradient' : 'stacked',
    //   //whether to show the labels for the slices
    //   showLabels:true,
    //   //resize labels according to
    //   //pie slices values set 7px as
    //   //min label size
    //   resizeLabels: 7,
    //   //label styling
    //   Label: {
    //     type: labelType, //Native or HTML
    //     size: 20,
    //     family: 'Arial',
    //     color: 'white'
    //   },
    //   //enable tips
    //   Tips: {
    //     enable: true,
    //     onShow: function(tip, elem) {
    //        tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
    //     }
    //   }
    // });
    // pieChart.loadJSON(json);

    // // BarChart V
    var barChart = new $jit.BarChart({
      //id of the visualization container
      injectInto: 'infovis',
      //whether to add animations
      animate: true,
      //horizontal or vertical barcharts
      orientation: 'vertical',
      //bars separation
      barsOffset: 20,
      //visualization offset
      Margin: {
        top:5,
        left: 5,
        right: 5,
        bottom:5
      },
      //labels offset position
      labelOffset: 5,
      //bars style
      type: useGradients? 'stacked:gradient' : 'stacked',
      //whether to show the aggregation of the values
      showAggregates:true,
      //whether to show the labels for the bars
      showLabels:true,
      //labels style
      Label: {
        type: labelType, //Native or HTML
        size: 13,
        family: 'Arial',
        color: 'white'
      },
      //add tooltips
      Tips: {
        enable: true,
        onShow: function(tip, elem) {
          tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
        }
      }
    });
    barChart.loadJSON(json);

    // BarChart H
    // var barChart = new $jit.BarChart({
    //   //id of the visualization container
    //   injectInto: 'infovis',
    //   //whether to add animations
    //   animate: true,
    //   //horizontal or vertical barcharts
    //   orientation: 'horizontal',
    //   //bars separation
    //   barsOffset: 0.5,
    //   //visualization offset
    //   Margin: {
    //     top: 5,
    //     left: 5,
    //     right: 5,
    //     bottom: 5
    //   },
    //   //labels offset position
    //   labelOffset:5,
    //   //bars style
    //   type:'stacked',
    //   //whether to show the aggregation of the values
    //   showAggregates:true,
    //   //whether to show the labels for the bars
    //   showLabels:true,
    //   //label styles
    //   Label: {
    //     type: labelType, //Native or HTML
    //     size: 13,
    //     family: 'Arial',
    //     color: 'white'
    //   },
    //   //tooltip options
    //   Tips: {
    //     enable: true,
    //     onShow: function(tip, elem) {
    //       tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
    //     }
    //   }
    // });
    // barChart.loadJSON(json);
}
