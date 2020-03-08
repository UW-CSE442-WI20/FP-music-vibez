const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

var data = []; 
var dots;

const margin = { top: 30, right: 40, bottom: 20, left: 50 };
const width = 600;
const height = 500;

class SalesChart extends D3Component {

  componentDidUpdate(nextProps) {
     const { show } = props
     if (nextProps.show !== show) {
      if (show) {
        console.log(props);
      }
     }
    }

/*
  getDerivedStateFromProps() {
    console.log("hiiii");
    console.log(this.props);
  }
*/

  initialize(node, props) {

    fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        data = d3.csvParse(text);
        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
        });
        // console.log(data);
       // const margin = { top: 30, right: 40, bottom: 20, left: 50 };
       // const width = 600;
       // const height = 500;
        this.svg = d3.select(node)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
          .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
          .range([ 0, width ]);
        this.svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .ticks(7)
            .tickFormat(d3.timeFormat("%Y")));

        // Add Y axis -- need to double check this logic
        var y = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 
        this.svg.append("g")
          .call(d3.axisLeft(y));

        // Add dots
        dots = this.svg.append('g')
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.Year); } )
            .attr("cy", function (d) { return y(d.Rank); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2");
        return this.svg.node();
      })
  
  }

  // need to only add new points!! (or remove axes at least)
  update(props) {
    //console.log(props.years);
    console.log("in update");
      fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        data = d3.csvParse(text);


        var filterStart = Date.parse(props.years[0]);
        var filterEnd = Date.parse(props.years[props.years.length - 1]);
        console.log("start ",filterStart, props.years[0]);
        console.log("end ", filterEnd);
        var filteredData = [];
        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year <= filterEnd) {
            filteredData.push(d);
          } 
        });
        //console.log(filteredData);

        var x = d3.scaleLinear()
          .domain([d3.min(filteredData, d => d.Year), d3.max(filteredData, d => d.Year)])
          .range([ 0, width ]);
        var y = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 

        var xAxis = d3.axisBottom(x).ticks(7)
            .tickFormat(d3.timeFormat("%Y"));
        this.svg.select(".x-axis").transition().duration(500).call(xAxis);

        dots.data(filteredData).enter().append("circle")
                        .attr("r",1.5);

        dots.transition()
            .duration(500)
            .attr("cx", function (d) { return x(d.Year); } )
            .attr("cy", function (d) { return y(d.Rank); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2");


        dots.exit().remove();


        //console.log(dots);

       // dots.exit().remove();//remove unneeded circles
       // dots.enter().append("circle")
        //                .attr("r",1.5);


        return this.svg.node();

      })


  }

}

module.exports = SalesChart;
