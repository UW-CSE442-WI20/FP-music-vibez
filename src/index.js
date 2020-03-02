// libraries
var d3 = require("d3");
var cloud = require("d3-cloud");
var slider = require("d3-simple-slider");

// local JS files:
import MyClass from "./my-class";
const myClassInstance = new MyClass();
myClassInstance.sayHi();

import { getLyricCounts } from "./data.js";

/*
d3.csv("carbon-emissions.csv").then(data => {
  console.log("Dynamically loaded CSV data", data);
});
*/

var yearSelected = 2015; 

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


var layout; 
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
      alert(d.text + " " + d.size); // instead we'll navigate to next page
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
					  console.log(yearSelected);
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


/*
var yearsSelected = [1960, 1995];

// Range Slider
var sliderRange = slider
  .sliderBottom()
  .min(d3.min(yearsData))
  .max(d3.max(yearsData))
  .width(300)
  .marks(yearsData)
  .tickFormat(d3.format(".0f"))
  .ticks(10)
  .default(yearsSelected)
  .fill("#045DE9")
  .on("onchange", val => {
    d3.select("p#value-range").text("Years " + val.map(d3.format(".0f")).join(" - "));
    yearsSelected = val;
  });

var gRange = d3
  .select("div#slider-range")
  .append("svg")
  .attr("width", 400)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

gRange.call(sliderRange);

d3.select("p#value-range").text("Years " + 
  sliderRange
    .value()
    .map(d3.format(".0f"))
    .join(" - ")
);
*/