const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const size = 600;
const startYear = 10/30/1971;
const endYear = 12/27/2003;
var data = undefined; 


class SalesChart extends D3Component {

  initialize(node, props) {

      fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        data = d3.csvParse(text);

        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
        });
        console.log(data);
      })

  }

}

  //initialize(node, props) {


//weekly-charts/michael-jackson-weekly-charts.csv
    
  /*  const myDataLocation = require("../michael.csv");
    console.log(myDataLocation); // prints out a string, not parsed data

    d3.csv(myDataLocation).then((error, data) => {
        if (error) { console.log("got an error!"); 
          throw error;
        } else {
          console.log("found the data?");
        }
      console.log(data);
    })*/
/*
    d3.csv("../data/yearlySingles.csv", function(error, data) {
        if (error) { console.log("got an error!"); 
          throw error;
        } else {
          console.log("found the data?");
        }

        data.forEach(function(d) {
          //d.date = parseDate(d.date);
          //d.close = +d.close;
          console.log(d);
      });
    });
*/
   /* const margin = { top: 30, right: 40, bottom: 10, left: 50 };
    const barHeight = 25;
    const width = 600;*/
   // const height =
    //  Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;
/*
    const yAxis = g =>
      g.attr("transform", `translate(${margin.left},0)`).call(
        d3
          .axisLeft(y)
          .tickFormat(i => data[i].name)
          .tickSizeOuter(0)
      );

    const xAxis = g =>
      g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 80))
        .call(g => g.select(".domain").remove());

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.sales)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.top, height - margin.bottom]);

    this.svg = d3
      .select(node)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "sans-serif");

    const bar = this.svg
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i)})`);

    bar
      .append("rect")
      .attr("fill", "steelblue")
      .attr("x", x(0))
      .attr("width", d => x(d.sales) - x(0))
      .attr("height", y.bandwidth() - 1);

    // bar
    //   .append("text")
    //   .attr("fill", "black")
    //   .attr("x", d => x(d.sales) + 3)
    //   .attr("y", y.bandwidth() / 2)
    //   .attr("dy", "0.35em")
    //   .text(d => d.sales);

    this.svg.append("g").call(yAxis);
    this.svg.append("g").call(xAxis);

    return this.svg.node();

    */
 // }
//}

module.exports = SalesChart;
