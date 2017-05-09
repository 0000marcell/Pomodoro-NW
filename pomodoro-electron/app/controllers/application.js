import Ember from 'ember';
import { select  } from 'd3-selection';
import { scaleLinear  } from 'd3-scale';

const links = [{icon: 'clock-o', name: 'schedule', link: 'schedule'},
               {icon: 'bar-chart', name: 'statistics', link: 'statistics'},
               {icon: 'cog', name: 'configuration', link: 'configuration'}]

export default Ember.Controller.extend({
  links: links,
  clock: {
    state: 'paused',
    mode: 'pomodoro'
  },
  savePomodoro: Ember.computed('clock', function(){
    if(this.get('clock.mode') === 'interval'){
      alert('save pomodoro!');
    }    
  }),
  actions: {
    graphIt(){
      var dataArray = [20, 40, 50];
      var colors = ['#E91E63', '#9C27B0', '#673AB7'];
      var width = 500;
      var height = 500;
      var canvas = select(".graph")
                     .append("svg")
                     .attr('width', 500)
                     .attr('height', 500)
                     .attr("fill", '#ff00ff');  
      var widthScale = scaleLinear()
                 .domain([0, 60])
                 .range([0, width]);
      var bars = canvas.selectAll("rect")
            .data(dataArray)
            .enter()
              .append("rect")
              .attr("width", function(d) { return widthScale(d); })
              .attr("height", 50)
              .attr("fill", function(d, i){ return colors[i]; })
              .attr("y", function(d, i) { return i * 60;});

    }
  }
});
