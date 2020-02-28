// libraries
var d3 = require("d3");
var cloud = require("d3-cloud");
var slider = require("d3-simple-slider");

// local JS files:
import MyClass from './my-class';
const myClassInstance = new MyClass();
myClassInstance.sayHi();

d3.csv('carbon-emissions.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
  })

var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15},{"text":"traditional","size":15},{"text":"fields","size":15},{"text":"acoustics","size":15},{"text":"optics","size":15},{"text":"mechanics","size":20},{"text":"thermodynamics","size":15},{"text":"electromagnetism","size":15},{"text":"modern","size":15},{"text":"extensions","size":15},{"text":"thefreedictionary","size":15},{"text":"interaction","size":15},{"text":"org","size":25},{"text":"answers","size":5},{"text":"natural","size":15},{"text":"objects","size":5},{"text":"treats","size":10},{"text":"acting","size":5},{"text":"department","size":5},{"text":"gravitation","size":5},{"text":"heat","size":10},{"text":"light","size":10},{"text":"magnetism","size":10},{"text":"modify","size":5},{"text":"general","size":10},{"text":"bodies","size":5},{"text":"philosophy","size":5},{"text":"brainyquote","size":5},{"text":"words","size":5},{"text":"ph","size":5},{"text":"html","size":5},{"text":"lrl","size":5},{"text":"zgzmeylfwuy","size":5},{"text":"subject","size":5},{"text":"distinguished","size":5},{"text":"chemistry","size":5},{"text":"biology","size":5},{"text":"includes","size":5},{"text":"radiation","size":5},{"text":"sound","size":5},{"text":"structure","size":5},{"text":"atoms","size":5},{"text":"including","size":10},{"text":"atomic","size":10},{"text":"nuclear","size":10},{"text":"cryogenics","size":10},{"text":"solid-state","size":10},{"text":"particle","size":10},{"text":"plasma","size":10},{"text":"deals","size":5},{"text":"merriam-webster","size":5},{"text":"dictionary","size":10},{"text":"analysis","size":5},{"text":"conducted","size":5},{"text":"order","size":5},{"text":"understand","size":5},{"text":"behaves","size":5},{"text":"en","size":5},{"text":"wikipedia","size":5},{"text":"wiki","size":5},{"text":"physics-","size":5},{"text":"physical","size":5},{"text":"behaviour","size":5},{"text":"collinsdictionary","size":5},{"text":"english","size":5},{"text":"time","size":35},{"text":"distance","size":35},{"text":"wheels","size":5},{"text":"revelations","size":5},{"text":"minute","size":5},{"text":"acceleration","size":20},{"text":"torque","size":5},{"text":"wheel","size":5},{"text":"rotations","size":5},{"text":"resistance","size":5},{"text":"momentum","size":5},{"text":"measure","size":10},{"text":"direction","size":10},{"text":"car","size":5},{"text":"add","size":5},{"text":"traveled","size":5},{"text":"weight","size":5},{"text":"electrical","size":5},{"text":"power","size":5}];

var color = d3.scaleLinear()
    .domain([0,1,2,3,4,5,6,10,15,20,100])
    .range(["#ED3108", "#7AD00C", "#ED0827", "#ED086D", "#EA08ED", "#9308ED", "#084AED", "#08C3ED", "#08ED96", "#58ED08", "#EAED08", "#0A0909"]);

  var layout = cloud()
  .size([500, 500])
      .words(frequency_list)
  .padding(5)
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function(d) { return d.size; })
  .on("end", draw);

layout.start();

function draw(words) {
d3.select("body").append("svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
  .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
  .selectAll("text")
    .data(words)
  .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function(d, i) { return color(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; })
    .on('mouseover', function(d, i) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("font-size", function(d) { return d.size*1.2 + "px"; });
    })
    .on('mouseout', function(d, i) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("font-size", function(d) { return d.size + "px"; });
    })
    .on("click", function(d) { 
    alert(d.text); // instead we'll navigate to next page 
});

}

// will want to use data from csv instead 
var yearsData = []
for (var i = 1946; i < 2020; i++) {
	yearsData.push(i);
}

var yearsSelected = [1960, 1995]; 

// Range Slider 
var sliderRange = slider.sliderBottom()
					.min(d3.min(yearsData))
					.max(d3.max(yearsData))
					.width(300)
					.marks(yearsData)
					.tickFormat(d3.format('.0f'))
					.ticks(10)
					.default(yearsSelected)
					.fill('#045DE9')
					.on('onchange', val => {
					  d3.select('p#value-range').text(val.map(d3.format('.0f')).join(' - '));
					  yearsSelected = val;
					});

var gRange = d3.select('div#slider-range')
				.append('svg')
				.attr('width', 500)
				.attr('height', 100)
				.append('g')
				.attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
	sliderRange
	  .value()
	  .map(d3.format('.0f'))
	  .join(' - ')
);