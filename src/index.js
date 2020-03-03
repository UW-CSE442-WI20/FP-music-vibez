// libraries
var d3 = require("d3");
var cloud = require("d3-cloud");
var slider = require("d3-simple-slider");

// local JS files:
import MyClass from "./my-class";
const myClassInstance = new MyClass();
myClassInstance.sayHi();

import { getLyricCounts } from "./data.js";
import { getLyricCountsInYears } from "./data.js"

/*
d3.csv("carbon-emissions.csv").then(data => {
  console.log("Dynamically loaded CSV data", data);
});
*/

var color = d3
  .scaleLinear()
  .domain([0, 1, 3, 5, 10, 15, 20, 50, 100])//[0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
  .range([
    "#045DE9",
    "#09C6F9",
    "#BA8CD7", 
    "#48BF91",
    "#00B300",
    "#5B0A91",
    "#4DB4D7",
    "#400080", 
    "#008080"
  ]);


var yearSelected = 2015; 
var layout; 

startWordMap();

function startWordMap() {
	layout = null;
	layout = cloud()
	  .size([800, 500])
	  .words(getLyricCounts(yearSelected))
	  .padding(5)
	  .rotate(function() {
	    return ~~(Math.random() * 2) * 90;
	  })
	  .font("Helvetica Neue")
	  .fontSize(function(d) {
	    return d.size;
	  })
	  .on("end", draw);

	layout.start();
}

function draw(words) {
  d3.select("#word-map-svg")
  	.remove();

  d3.select("#word-map")
    .append("svg")
    .attr("id", "word-map-svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
    .append("g")
    .attr(
      "transform",
      "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
    )
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function(d) {
      return d.size + "px";
    })
    .style("font-family", "Helvetica Neue")
    .style("fill", function(d, i) {
      return color(i);
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) {
      return d.text;
    })
    .on("mouseover", function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .style("font-size", function(d) {
          return d.size * 1.2 + "px";
        });
    })
    .on("mouseout", function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .style("font-size", function(d) {
          return d.size + "px";
        });
    })
    .on("click", function(d) {
      //alert(d.text + " " + d.size); // instead we'll navigate to next page
      loadLineChart(d.text);
    });
}

// will want to use data from csv instead
var yearsData = [];
for (var i = 1946; i < 2020; i++) {
  yearsData.push(i);
}

var sliderStep = slider.sliderBottom()
					.min(d3.min(yearsData))
					.max(d3.max(yearsData))
					.width(300)
					.tickFormat(d3.format('.0f'))
					.ticks(10)
					.step(1)
					.default(yearSelected)
					.on('onchange', val => {
					  d3.select('p#value-time').text(d3.format('.0f')(val));
					  yearSelected = val;
					  startWordMap();
					});

var gStep = d3.select('div#slider-time')
				.append('svg')
				.attr('width', 500)
				.attr('height', 100)
				.append('g')
				.attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-time').text(d3.format('.0f')(sliderStep.value()));


// Bar Chart
function loadLineChart(word) {
	d3.select('p#selected-word').text("Selected word: " + word);
	d3.select("#bar-chart").remove();

	var lyricCountData = getLyricCountsInYears(word);
	//console.log(lyricCountData);

	/*for (let [key, value] of Object.entries(lyricCountData)) {
		console.log(`${key}: ${value}`);
	}
	console.log("done with the loop");*/

	var padding = 20;
    var width = 800;
    var height = 500;

    var margin = ({top: 20, right: 0, bottom: 30, left: 40})


	var x = d3.scaleBand()
		    .domain(d3.range(lyricCountData.length))
		    .range([margin.left, width - margin.right])
		    .padding(0.1);


    var y = d3.scaleLinear()
		    .domain([0, d3.max(lyricCountData, d => d.value)]).nice()
		    .range([height - margin.bottom, margin.top]);


	var xAxis = g => g
				    .attr("transform", `translate(0,${height - margin.bottom})`)
				    .call(d3.axisBottom(x).tickFormat(i => lyricCountData[i].name).tickSizeOuter(0))

    var yAxis = g => g
				    .attr("transform", `translate(${margin.left},0)`)
				    .call(d3.axisLeft(y))
				    .call(g => g.select(".domain").remove())


	var chart = d3.select("#bar-chart-container")
    	.append("svg")
    	.attr("id", "bar-chart")
		.attr("viewBox", [0, 0, width, height]);

	chart.append("g")
	 	.attr("fill", "#045DE9")
		.selectAll("rect")
		.data(lyricCountData)
		.join("rect")
		.attr("x", (d, i) => x(i))
		.attr("y", d => y(d.value))
		.attr("height", d => y(0) - y(d.value))
		.attr("width", x.bandwidth());

	chart.append("g")
	  .call(xAxis);

	chart.append("g")
	  .call(yAxis);
	 
}
