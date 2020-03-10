const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const allData = {
  gaga: [
    {
      "album-name": "The Fame",
      "release-date": "10/28/2008",
      "worldwide-sales": 15000000,
      year: 2008
    },
    {
      "album-name": "Born This Way",
      "release-date": "05/23/2011",
      "worldwide-sales": 6000000,
      year: 2011
    },
    {
      "album-name": "ARTPOP",
      "release-date": "11/11/2013",
      "worldwide-sales": 2500000,
      year: 2013
    },
    {
      "album-name": "Cheek to Cheek",
      "release-date": "09/23/2014",
      "worldwide-sales": 1000000,
      year: 2014
    },
    {
      "album-name": "Joanne",
      "release-date": "10/21/2016",
      "worldwide-sales": 1000000,
      year: 2016
    },
    {
      "album-name": "A Star Is Born",
      "release-date": "10/5/2018",
      "worldwide-sales": 114800000,
      year: 2018
    },
    {
      "album-name": "Chromatica",
      "release-date": "04/10/2020",
      "worldwide-sales": 0,
      year: 2020
    }
  ],

  kanye: [
    {
      "album-name": "The College Dropout",
      "release-date": "02/10/2004",
      "worldwide-sales": "4000000"
    },
    {
      "album-name": "Late Registration",
      "release-date": "08/30/2005",
      "worldwide-sales": "3100000"
    },
    {
      "album-name": "Graduation",
      "release-date": "09/11/2007",
      "worldwide-sales": "2700000"
    },
    {
      "album-name": "808s & Heartbreaks",
      "release-date": "11/24/2008",
      "worldwide-sales": "1700000"
    },
    {
      "album-name": "My Beautiful Dark Twisted Fantasy",
      "release-date": "11/22/2010",
      "worldwide-sales": "2000000"
    },
    {
      "album-name": "Yeezus",
      "release-date": "06/18/2013",
      "worldwide-sales":"1000000"
    },
    {
      "album-name": "The Life Of Pablo",
      "release-date": "02/14/2016",
      "worldwide-sales":"2000000"
    },
    {
      "album-name": "Ye",
      "release-date": "06/01/2018",
      "worldwide-sales": "500000"
    },
    {
      "album-name": "Jesus Is King",
      "release-date": "10/25/2019",
      "worldwide-sales": "300000"
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
    const { artist, step, years } = props;
    const data = this.getData(artist, step, years);

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
    const { artist, step, years } = props;
    const data = this.getData(artist, step, years);

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
    xScale = d3
      .scaleLinear()
      .domain([0, this.getMaxSales(data)])
      .range([0, width]);
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
  getData(artist, step, years) {
    console.log("getData called with", artist, step, years);
    if (!(artist in allData)) {
      return [];
    }
    let res = [];
    for (let i = 0; i < allData[artist].length; i++) {
      if (allData[artist][i]["year"] >= years[step]) {
        res.push(allData[artist][i]);
      }
    }

    return res;
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
