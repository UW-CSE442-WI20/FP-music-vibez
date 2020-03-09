const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

var data = []; 
var dots;
var tooltipDiv; 

var xScale, yScale;

var dotRadius = 2;
var dotColor = "#696969";

const margin = { top: 30, right: 40, bottom: 20, left: 50 };
const width = 600;
const height = 500;

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

        this.svg = d3.select(node)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // add X axis 
        xScale = d3.scaleLinear()
          .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
          .range([ 0, width ]);
        this.svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale)
            .ticks(7)
            .tickFormat(d3.timeFormat("%Y")));

        // add Y axis
        yScale = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 
        this.svg.append("g")
          .call(d3.axisLeft(yScale)
            .tickValues([1, 25, 50, 75, 100])
            .tickFormat(x => `#${x}`));

        // initialize tooltip 
        tooltipDiv = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);

        // add dots
        dots = this.svg.append('g')
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return xScale(d.Year); } )
            .attr("cy", function (d) { return yScale(d.Rank); } )
            .attr("r", dotRadius)
            .style("fill", dotColor)
            .on('mouseenter', (d, i, nodes) => {
              this.handleMouseEnter(d, i, nodes, data);
            })
            .on('mouseout', (d, i, nodes) => {
              this.handleMouseOut(d, i, nodes, data);
            });

        return this.svg.node();
      })
  
  }



  update(props) {
      fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        data = d3.csvParse(text);

        var filterStart = Date.parse(props.years[0]);
        var filterEnd = Date.parse(props.years[props.years.length - 1]);
        console.log("start ", props.years[0]);
        console.log("end ", props.years[props.years.length - 1]);
        var filteredData = [];
        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year <= filterEnd) {
            filteredData.push(d);
          } 
        });
        //console.log(filteredData);

        xScale = d3.scaleLinear()
          .domain([d3.min(filteredData, d => d.Year), d3.max(filteredData, d => d.Year)])
          .range([ 0, width ]);
        yScale = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 

        var xAxis = d3.axisBottom(xScale).ticks(7)
            .tickFormat(d3.timeFormat("%Y"));
        this.svg.select(".x-axis").transition().duration(500).call(xAxis);

        dots.data(filteredData).enter().append("circle")
                        .attr("r", dotRadius)
                        .on('mouseenter', (d, i, nodes) => {
                          this.handleMouseEnter(d, i, nodes, filteredData);
                        })
                        .on('mouseout', (d, i, nodes) => {
                          this.handleMouseOut(d, i, nodes, filteredData);
                        });

        dots.transition()
            .duration(500)
            .attr("cx", function (d) { return xScale(d.Year); } )
            .attr("cy", function (d) { return yScale(d.Rank); } )
            .attr("r", dotRadius)
            .style("fill", dotColor);

        dots.exit().remove();

        return this.svg.node();

      })

  }

  handleMouseEnter(d, i, nodes, data) {
    d3.select(nodes[i])
    .attr('r', (d) => {
      return dotRadius * 2.5;
    });

    var resizedData = this.resizeSongPoints(nodes, d['Song Title'], data, 2.5);
    this.connectSongPoints(resizedData);

    tooltipDiv.transition()    
                .duration(100)    
                .style("opacity", .95); 

    tooltipDiv.html("<b>" + d['Song Title'] +  "</b><br/>Date: " 
     + (new Date(d.Year).toLocaleDateString()) + "<br/>Rank: #"  + d.Rank)  
        .style("left", (d3.event.pageX + 7) + "px")   
        .style("top", (d3.event.pageY - 37) + "px")
        .style("display", "inline-block");  

  }

  handleMouseOut(d, i, nodes, data) {
    d3.select(nodes[i])
    .attr('r', (d) => {
      return dotRadius;
    });

    this.resizeSongPoints(nodes, d['Song Title'], data, 1);
    d3.select("path.line").remove();

    tooltipDiv.transition()    
                .duration(300)    
                .style("opacity", 0); 
  }

  resizeSongPoints(nodes, song, data, scaleFactor) {
    var resizedData = []
    for (var i = 0; i < data.length; i++) {
      if (data[i]['Song Title'] === song) {
        resizedData.push(data[i]);
        d3.select(nodes[i])
          .attr('r', (d) => {
            return dotRadius * scaleFactor;
          });
      }
    }
    return resizedData;

  }

  connectSongPoints(songData) {
    var line = d3.line()
        .x(function(d, i) { return xScale(d.Year); }) 
        .y(function(d) { return yScale(d.Rank); });

    this.svg.append("path")
      .datum(songData) 
      .attr("class", "line")  
      .attr("d", line)
      .lower();

  }

}

module.exports = SalesChart;
