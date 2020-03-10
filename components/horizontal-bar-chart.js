const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const allData = {
  gaga: [
    {
      "album-name": "The Fame",
      "release-date": "10/28/2008",
      "worldwide-sales": 15000000
    },
    {
      "album-name": "Born This Way",
      "release-date": "05/23/2011",
      "worldwide-sales": 6000000
    },
    {
      "album-name": "ARTPOP",
      "release-date": "11/11/2013",
      "worldwide-sales": 2500000
    },
    {
      "album-name": "Cheek to Cheek",
      "release-date": "09/23/2014",
      "worldwide-sales": 1000000
    },
    {
      "album-name": "Joanne",
      "release-date": "10/21/2016",
      "worldwide-sales": 1000000
    },
    {
      "album-name": "A Star Is Born",
      "release-date": "10/5/2018",
      "worldwide-sales": 114800000
    },
    {
      "album-name": "Chromatica",
      "release-date": "04/10/2020",
      "worldwide-sales": 0
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
    }, 
  ],
  michael: [
    {
      "album-name": "Got To Be There",
      "release-date": "01/24/1972",
      "worldwide-sales": null
    },
    {
      "album-name": "Ben",
      "release-date": "08/04/1972",
      "worldwide-sales": null
    },
        {
      "album-name": "Music & Me",
      "release-date": "04/13/1973",
      "worldwide-sales": null
    },
    {
      "album-name": "Forever, Michael",
      "release-date": "01/16/1975",
      "worldwide-sales": null
    },
    {
      "album-name": "Off the Wall",
      "release-date": "08/10/1979",
      "worldwide-sales": 20000000
    },
        {
      "album-name": "Thriller",
      "release-date": "11/30/1982",
      "worldwide-sales": 66000000
    },
    {
      "album-name": "Bad",
      "release-date": "09/01/1987",
      "worldwide-sales": 35000000
    },
    {
      "album-name": "Dangerous",
      "release-date": "11/26/1991",
      "worldwide-sales": 32000000
    },
    {
      "album-name": "HIStory: Past, Present and Future, Book I",
      "release-date": "06/20/1995",
      "worldwide-sales": 22000000
    },
    {
      "album-name": "Invincible",
      "release-date": "10/30/2001",
      "worldwide-sales": 6000000
    },
    {
      "album-name": "Michael",
      "release-date": "06/25/2009",
      "worldwide-sales": 541000
    },
    {
      "album-name": "Xscape",
      "release-date": "12/10/2010",
      "worldwide-sales": 1700000
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
