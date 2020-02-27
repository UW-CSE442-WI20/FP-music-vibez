

// You can require libraries
var d3 = require("d3");
var cloud = require("d3-cloud");

// You can include local JS files:
import MyClass from './my-class';
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('carbon-emissions.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
  })

  var layout = cloud()
  .size([500, 500])
  .words([
    "Hello", "world", "normally", "you", "want", "more", "words",
    "than", "this"].map(function(d) {
    return {text: d, size: 10 + Math.random() * 90, test: "haha"};
  }))
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
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}