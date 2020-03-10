const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const allData = {
  gaga: [
    {
      "album-name": "The Fame",
      "release-date": "2008-10-28",
      "worldwide-sales": 15000000
    },
    {
      "album-name": "Born This Way",
      "release-date": "2011-05-18",
      "worldwide-sales": 6000000
    },
    {
      "album-name": "ARTPOP",
      "release-date": "2013-11-11",
      "worldwide-sales": 2500000
    },
    {
      "album-name": "Cheek to Cheek",
      "release-date": "2014-09-23",
      "worldwide-sales": 1000000
    },
    {
      "album-name": "Joanne",
      "release-date": "2016-10-21",
      "worldwide-sales": 1000000
    },
    {
      "album-name": "A Star Is Born",
      "release-date": "2018-10-05",
      "worldwide-sales": 114800000
    }
  ]
};

const margin = { top: 30, right: 40, bottom: 20, left: 100 };
const width = 600;
const height = 300;

var yScale;
var xScale;

class HorizontalBarChart extends D3Component {
  initialize(node, props) {
    const { artist, to } = props;
    const data = this.getData(artist, to + 1);

    this.svg = d3
      .select(node)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Y axis scale
    yScale = d3
      .scaleBand()
      .range([0, height])
      .padding(0.5)
      .domain(this.getAlbumNames(data));

    // X axis scale
    xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, this.getMaxSales(data)]);

    // add bars

    this.svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {
        return xScale(d["worldwide-sales"]);
      })
      .attr("y", function(d) {
        return yScale(d["album-name"]);
      })
      .attr("height", yScale.bandwidth());

    // Append the y-axis
    this.svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(data.length));

    // Append the x-axis
    this.svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    return this.svg.node();
  }

  update(props) {
    const { artist, to } = props;
    const data = this.getData(artist, to);
    console.log("update", props, data);

    // update yScale, yAxis
    yScale = d3
          .scaleBand()
          .range([0, height])
          .padding(0.5)
          .domain(this.getAlbumNames(data));
    var yAxis = d3.axisLeft(yScale).ticks(data.length);
    this.svg
      .select(".y-axis")
      .transition()
      .duration(500)
      .call(yAxis);

    // update xScale, xAxis
    xScale = d3.scaleLinear()
          .domain([0, this.getMaxSales(data)])
          .range([ 0, width ]);
    var xAxis = d3.axisBottom(xScale);
    this.svg
      .select(".x-axis")
      .transition()
      .duration(500)
      .call(xAxis);

    this.svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar");

    this.svg
      .selectAll(".bar")
      .transition()
      .duration(500)
      .attr("height", yScale.bandwidth())
      .attr("width", function(d) {
        return xScale(d["worldwide-sales"]);
      })
      .attr("y", function(d) {
        return yScale(d["album-name"]);
      });

    this.svg
      .selectAll(".bar")
      .data(data)
      .exit()
      .remove();

    return this.svg.node();
  }

  // Utilities

  // Returns a json object with the data for the seleted artist
  // up to but not including the ith entry
  getData(artist, i) {
    console.log("getData called with", artist, i);
    if (!(artist in allData)) {
      return [];
    }
    return allData[artist].slice(0, i);
  }

  // Returns the maximum sales for the given data
  getMaxSales(data) {
    return Math.max(...this.getSales(data));
  }

  // Returns a list of album names from the data
  // Preserves the ordering
  getAlbumNames(data) {
    return this.extractData(data, "album-name");
  }

  // Returns a list of worldwide-sales from the data
  // Preserves the ordering of the original data
  getSales(data) {
    return this.extractData(data, "worldwide-sales");
  }

  // Returns a list of the given attribute from a json dictionary
  extractData(data, key) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      res.push(data[i][key]);
    }
    console.log("extractData(" + key + ")", data, res);
    return res;
  }
}

module.exports = HorizontalBarChart;
