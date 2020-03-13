const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");
const chromatic = require("d3-scale-chromatic");

//var data = []; 
//var dots;
var tooltipDiv; 

var xScale, yScale;

var dotRadius = 2;
var dotColor = "#696969";

const margin = { top: 30, right: 40, bottom: 20, left: 50 };
const width = 700 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

var albumToColorMap = new Map();

class SalesChart extends D3Component {


  initialize(node, props) {

    // create color scale
    var colorScale = this.props.colors;
    //var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var i = 0;
    this.props.albums.forEach(function(d) {
      //console.log(colorScale[i])
      albumToColorMap.set(d, colorScale[i]);
      i += 1;
    })

    fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        var data = d3.csvParse(text);

        var filterStart = Date.parse(props.years[0]);
        var filterEnd = Date.parse(props.years[props.years.length - 1]);
        var filteredData = [];
        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year < filterEnd) {
            filteredData.push(d);
          } 
        });

        this.svg = d3.select(node)
          .append("svg")
            .attr("width", width + margin.left + margin.right - 10)
            .attr("height", height + margin.top + margin.bottom + 20)
            .attr("class", "singles-chart")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // add X axis 
        xScale = d3.scaleLinear()
          .domain([d3.min(props.years, d =>  Date.parse(d)), d3.max(props.years, d =>  Date.parse(d))])
          .range([ 0, width ]);

        var maxYear = d3.max(props.years, d => Date.parse(d)); 
        var minYear = d3.min(props.years, d => Date.parse(d));
      
        this.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
          .ticks(5)
          .tickFormat(d3.timeFormat("%b %Y")));

        // X axis label
        this.svg.append("text")             
          .attr("transform",
                "translate(" + (width / 2) + " ," + 
                               (height + margin.top) + ")")
          .style("text-anchor", "middle")
          .text("Time");

        // add Y axis
        yScale = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 
        this.svg.append("g")
          .call(d3.axisLeft(yScale)
            .tickValues([1, 25, 50, 75, 100])
            .tickFormat(x => `#${x}`));

        // Y axis label
        this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Rank");   

        // add title
        this.svg.append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text(props.name + "'s Singles Rank through Time"); 

        // initialize tooltip 
        tooltipDiv = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);

        //console.log("FILTERED DATA", filteredData);
        // add dots
        var dots = this.svg.append('g')
          .selectAll("dot")
          .data(filteredData)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return xScale(d.Year); } )
            .attr("cy", function (d) { return yScale(d.Rank); } )
            .attr("r", dotRadius)
            .attr("class", "singles-circles")
            .style("fill", function(d) { 
              return albumToColorMap.get(d.Album) })
            .on('mouseenter', (d, i, nodes) => {
              this.handleMouseEnter(d, i, nodes);
            })
            .on('mouseout', (d, i, nodes) => {
              this.handleMouseOut(d, i, nodes);
            });

        return this.svg.node();
      })
  
  }

  update(props) {
      fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        var data = d3.csvParse(text);
        var filterStart = Date.parse(props.years[0]);
        var filterEnd = Date.parse(props.years[props.years.length - 1]);
        //console.log("start ", props.years[0]);
        //console.log("end ", props.years[props.years.length - 1]);

        var yearDiff = (new Date(filterEnd)).getFullYear() - (new Date(filterStart)).getFullYear();
        if (yearDiff > 6) {
          //console.log("year diff too large", yearDiff);
          filterStart = (new Date(filterEnd)).setFullYear((new Date(filterEnd)).getFullYear() - 5)
        }

        var filteredData = [];
        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year < filterEnd) {
            filteredData.push(d);
          } 
        });

        xScale = d3.scaleLinear()
            .domain([filterStart, filterEnd])
            //.domain([minYear, maxYear])
            .range([ 0, width ]);
        var xAxis = d3.axisBottom(xScale).ticks(5)
            .tickFormat(d3.timeFormat("%b %Y"));
        this.svg.select(".x-axis").transition().duration(1500).call(xAxis);

        yScale = d3.scaleLinear()
          .domain([100, 1])
          .range([ height, 0]); 

        var circles = this.svg.selectAll("circle")
                        .data(filteredData);

        circles.exit()
                .transition()
                .delay(function(d,i){return(i*3)})
                .duration(500)
                .attr("r", 0)
                .remove();

        var enterDots = circles.enter()
          .append("circle")
          .attr("r", 0)
          .attr("cx", function (d) { return xScale(d.Year); } )
          
        enterDots.transition()
                .delay(function(d,i){return(i*3)})
                .duration(1500)
                .attr("cy", function (d) { return yScale(d.Rank); } )
                .attr("r", dotRadius)
                .style("fill", 
                  function(d) { 
                    if (albumToColorMap.get(d.Album) != null) { 
                      return albumToColorMap.get(d.Album)}
                    else {
                      return "#000"
                    }
                });

        enterDots.on('mouseenter', (d, i, nodes) => {
            this.handleMouseEnter(d, i, nodes);
          })
          .on('mouseout', (d, i, nodes) => {
            this.handleMouseOut(d, i, nodes);
          });

        circles.transition()
          //.duration(700)
          .delay(function(d,i){return(i*3)})
          .duration(2000)
          .attr("r", dotRadius)
          .attr("cx", function (d) { return xScale(d.Year); } )
          .attr("cy", function (d) { return yScale(d.Rank); } )
          .style("fill", 
            function(d) { 
              if (albumToColorMap.get(d.Album) != null) { 
                return albumToColorMap.get(d.Album)}
              else {
                return "#000"
              }
          });


        return this.svg.node();

      })

  }

  handleMouseEnter(d, i, nodes) {
    d3.select(nodes[i])
    .attr('r', (d) => {
      return dotRadius * 2.5;
    });


    var resizedData = this.resizeSongPoints(nodes, d['Song Title'], 2.5);
    this.connectSongPoints(resizedData, d.Album);

    tooltipDiv.transition()    
                .duration(100)    
                .style("opacity", .95); 

    tooltipDiv.html("<b>" + d['Song Title'] +  "</b><br/>Date: " 
     + (new Date(d.Year).toLocaleDateString()) + "<br/>Rank: #"  + d.Rank)  
        .style("left", (d3.event.pageX + 7) + "px")   
        .style("top", (d3.event.pageY - 37) + "px")
        .style("display", "inline-block");  

  }

  handleMouseOut(d, i, nodes) {
    d3.select(nodes[i])
    .attr('r', (d) => {
      return dotRadius;
    });

    this.resizeSongPoints(nodes, d['Song Title'], 1);
    d3.select("path.line").remove();

    tooltipDiv.transition()    
                .duration(300)    
                .style("opacity", 0); 
  }

  resizeSongPoints(nodes, song, scaleFactor) {
    var resizedData = []

    this.svg.selectAll('circle').style("r", function(d) {
      var dIsInSubset = d['Song Title'] === song;
      if(dIsInSubset) {
        resizedData.push(d);
        return dotRadius * scaleFactor;
      } else {
        return dotRadius;
      }
    })
    return resizedData;

  }

  connectSongPoints(songData, album) {
    var line = d3.line()
        .x(function(d, i) { return xScale(d.Year); }) 
        .y(function(d) { return yScale(d.Rank); });

        //console.log(albumToColorMap.get(album));

    this.svg.append("path")
      .datum(songData) 
      .attr("class", "line")  
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", function(d) { if (albumToColorMap.get(album) != null)
              { return albumToColorMap.get(album)}
              else {return "#000"}})
      .style("stroke-width", 3)
      .lower();

  }

}

module.exports = SalesChart;
