const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const margin = { top: 30, right: 40, bottom: 20, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 100 - margin.top - margin.bottom;

var tooltipDiv; 

var yScale;
var xScale;

const awar_svg = "M13.6-13.6h-6.4c2.4-1.6 4.8-4 4.8-7.2 0-4.8-3.2-8-8-8-4.8 0-8 3.2-8 8 0 3.2 1.6 5.6 4.8 7.2h-6.4c-3.2 0-5.6 2.4-5.6 4.8v15.2c0 2.4 2.4 4.8 4.8 4.8h1.6c0 0 0 .8 0 .8v15.2c0 2.4 1.6 4.8 2.4 4.8h10.4c1.6 0 2.4-2.4 2.4-4.8v-14.4c0 0 0-.8 0-.8h1.6c2.4 0 4.8-2.4 4.8-4.8v-16c1.6-2.4-.8-4.8-3.2-4.8z";

class AwardChart extends D3Component {
  initialize(node, props) {

    fetch(props.src)
        .then((response) => {
        return response.text();
      }).then((text) => {
        var data = d3.csvParse(text);
        console.log(data);

        var filterStart = Date.parse(props.years[0]);
        var filterEnd = Date.parse(props.years[props.years.length - 1]);
        var filteredData = [];

        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year < filterEnd) {
            filteredData.push(d);
          }
        });

        this.svg = d3
        .select(node)
        .append("svg")
        .attr("width", width + margin.left + margin.right - 10)
        .attr("height", height + margin.top + margin.bottom + 20);

        // find a better place for this 
        /*this.svg.append("text")
          .attr("x", (width / 2) + 30)             
          .attr("y", (margin.top / 2)+10)
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .attr("class", "awards-title")
          .text("Awards " + props.name + " Received By " + (new Date(filterEnd).toLocaleDateString())); 
*/

        // legend -- find better place 
        /*this.svg.append('g')
          .append("circle")
          .attr("class", "example1")
          .attr("cx", 20)
          .attr("cy", (margin.top+20))
          .attr("r", 5)
          .attr("fill", "red");
        
        this.svg.append("text")
          .attr("x", 20)             
          .attr("y", (margin.top+45))
          .attr("text-anchor", "middle")  
          .style("font-size", "12px") 
          .text("Won"); 
          
        this.svg.append('g')
          .append("circle")
          .attr("class", "example1")
          .attr("cx", 90)
          .attr("cy", (margin.top+20))
          .attr("r", 5)
          .attr("fill", "black");

          this.svg.append("text")
          .attr("x", 90)             
          .attr("y", (margin.top+45))
          .attr("text-anchor", "middle")  
          .style("font-size", "12px") 
          .text("Nominated");  
         */ 
        tooltipDiv = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);


        var all_awards = this.svg.append('g')
          .selectAll(".awards")
          .data(filteredData)
          .enter()
          //.append("path")
          .append("circle")
          .attr("class", "awards")
          //.attr('d', awar_svg)
          .attr("cx", function (d) {  
            if(d.Number <= 25) {
              return (d.Number*30)+10 ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return ((d.Number-26)*30)+10 ;
            } else {
              return ((d.Number-52)*30)+10;
            } } )
          .attr("cy", function (d) { if(d.Number <= 25) {
              return (margin.top+20) ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return (margin.top+50) ;
            } else {
              return (margin.top+80) ;
            } } )
          /*.attr("transform", function(d) { 
            if(d.Number <= 25) {
              return "translate(" + ((d.Number*30)+10) + "," + (margin.top+80) + ")" ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return "translate(" + (((d.Number-26)*30)+10) + "," + (margin.top+150) + ")" ;
            } else {
              return "translate(" + (((d.Number-52)*30)+10) + "," + (margin.top+220) + ")" ;
            }
          })*/
          .attr("fill", function(d) {if(d.Result === "Won"){return "red";}else{return "black";}})
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
        var filteredData = [];

        data.forEach(function(d) {
          d.Year = Date.parse(d.Year);
          if (filterStart <= d.Year && d.Year < filterEnd) {
            filteredData.push(d);
          } 
        });

        
        this.svg
          .selectAll(".awards")
          .data(filteredData)
          .enter()
          .append("circle")
          .attr("class", "awards")
          //.attr('d', awar_svg)
          .attr("cx", function (d) { 
            if(d.Number <= 25) {
              return (d.Number*30)+10 ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return ((d.Number-26)*30)+10 ;
            } else {
              return ((d.Number-52)*30)+10;
            } } )
          .attr("cy", function (d) { if(d.Number <= 25) {
              return (margin.top+20) ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return (margin.top+50) ;
            } else {
              return (margin.top+80) ;
            } } )
          .attr("r", 5)
          /*.attr("transform", function(d) { 
            if(d.Number <= 25) {
              return "translate(" + ((d.Number*30)+10) + "," + (margin.top+80) + ")" ;
            } else if (d.Number > 25 && d.Number <= 51) {
              return "translate(" + (((d.Number-26)*30)+10) + "," + (margin.top+150) + ")" ;
            } else {
              return "translate(" + (((d.Number-52)*30)+10) + "," + (margin.top+220) + ")" ;
            }
          })*/
          .attr("fill", function(d) {if(d.Result === "Won"){return "red";}else{return "black";}})
          .on('mouseenter', (d, i, nodes) => {
            this.handleMouseEnter(d, i, nodes);
          })
          .on('mouseout', (d, i, nodes) => {
            this.handleMouseOut(d, i, nodes);
          });

        this.svg
          .selectAll(".awards")
          .transition()
          .duration(500);
 
        this.svg
          .selectAll(".awards")
          .data(filteredData)
          .exit()
          .remove();


        // find a better place for this 
        //this.svg.select(".awards-title")
        //        .text("Awards " + props.name + " Received By " + (new Date(filterEnd).toLocaleDateString())); 

        return this.svg.node();

      })

  }

  handleMouseEnter(d, i, nodes) {
    d3.select(nodes[i])
    .attr('fill', (d) => {
      return "grey";
    }); 

    var curr = new Date(d.Year);

    tooltipDiv.transition()    
                .duration(100)    
                .style("opacity", .95);
    
    tooltipDiv.html("<b>" + d['Award'] +  "</b><br/>Year: " 
    + (curr.getFullYear()) + "<br/>Nominee:"  + d.Nominee + "<br/>"
    + d.Result)  
        .style("left", (d3.event.pageX - 7) + "px")   
        .style("top", (d3.event.pageY + 50) + "px")
        .style("display", "inline-block");  

  }

  handleMouseOut(d, i, nodes) {
    d3.select(nodes[i])
    .attr('fill', (d) => {
      if(d.Result === "Won"){return "red";}else{return "black";}
    }); 

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
}



module.exports = AwardChart;
