const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const size = 600;
const startYear = 10/30/1971;
const endYear = 12/27/2003;
var data = undefined; 


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

  update(props) {
    console.log(props.years);
  }

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

        const margin = { top: 30, right: 40, bottom: 20, left: 50 };
        const width = 600;
        const height = 500;


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
        this.svg.append('g')
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

}

module.exports = SalesChart;
