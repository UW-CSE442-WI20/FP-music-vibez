const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const allData = {
  gaga: [
    {
      "album-name": "The Fame",
      "release-date": "10/28/2008",
      "worldwide-sales": 15000000,
      year: 2008,
      color: "rgb(169,169,169)"
    },
    {
      "album-name": "Born This Way",
      "release-date": "05/23/2011",
      "worldwide-sales": 6000000,
      year: 2011,
      color: "rgb(105,105,105)"
    },
    {
      "album-name": "ARTPOP",
      "release-date": "11/11/2013",
      "worldwide-sales": 2500000,
      year: 2013,
      color: "rgb(0,0,165)"
    },
    {
      "album-name": "Cheek to Cheek",
      "release-date": "09/23/2014",
      "worldwide-sales": 1000000,
      year: 2014,
      color: "rgb(210,180,140)"
    },
    {
      "album-name": "Joanne",
      "release-date": "10/21/2016",
      "worldwide-sales": 1000000,
      year: 2016,
      color: "rgb(255,182,193)"
    },
    {
      "album-name": "A Star Is Born",
      "release-date": "10/5/2018",
      "worldwide-sales": 1148000,
      year: 2018,
      color: "rgb(255,215,0)"
    },
    {
      "album-name": "Chromatica",
      "release-date": "04/10/2020",
      "worldwide-sales": 0,
      year: 2020,
      color: "rgb(255,20,147)"
    }
  ],

  kanye: [
    {
      "album-name": "The College Dropout",
      "release-date": "02/10/2004",
      "worldwide-sales": "4000000",
      year: 2004,
      color: "rgb(255,215,0)"
    },
    {
      "album-name": "Late Registration",
      "release-date": "08/30/2005",
      "worldwide-sales": "3100000",
      year: 2005,
      color: "rgb(135, 76, 10)"
    },
    {
      "album-name": "Graduation",
      "release-date": "09/11/2007",
      "worldwide-sales": "2700000",
      year: 2007,
      color: "rgb(144, 2, 141)"
    },
    {
      "album-name": "808s & Heartbreak",
      "release-date": "11/24/2008",
      "worldwide-sales": "1700000",
      year: 2008,
      color: "rgb(191, 207, 207)"
    },
    {
      "album-name": "My Beautiful Dark Twisted Fantasy",
      "release-date": "11/22/2010",
      "worldwide-sales": "2000000",
      year: 2010,
      color: "rgb(255, 0, 38)"
    },
    {
      "album-name": "Yeezus",
      "release-date": "06/18/2013",
      "worldwide-sales": "1000000",
      year: 2013,
      color: "rgb(0,231,231)"
    },
    {
      "album-name": "The Life Of Pablo",
      "release-date": "02/14/2016",
      "worldwide-sales": "2000000",
      year: 2016,
      color: "rgb(242,121,0)"
    },
    {
      "album-name": "Ye",
      "release-date": "06/01/2018",
      "worldwide-sales": "500000",
      year: 2018,
      color: "rgb(57,255,20)"
    },
    {
      "album-name": "Jesus Is King",
      "release-date": "10/25/2019",
      "worldwide-sales": "300000",
      year: 2019,
      color: "rgb(20,57,255)"
    }
  ],
  michael: [
    {
      "album-name": "Got To Be There",
      "release-date": "01/24/1972",
      "worldwide-sales": 3200000,
      year: 1972,
      color: "rgb(79,121,66)"
    },
    {
      "album-name": "Ben",
      "release-date": "08/04/1972",
      "worldwide-sales": 5000000,
      year: 1972,
      color: "rgb(135, 76, 10)"
    },
    {
      "album-name": "Music & Me",
      "release-date": "04/13/1973",
      "worldwide-sales": 2000000,
      year: 1973,
      color: "rgb(0, 122, 87)"
    },
    {
      "album-name": "Forever, Michael",
      "release-date": "01/16/1975",
      "worldwide-sales": 1000000,
      year: 1975,
      color: "rgb(204,85,0)"
    },
    {
      "album-name": "Off the Wall",
      "release-date": "08/10/1979",
      "worldwide-sales": 20000000,
      year: 1979,
      color: "rgb(0,191,255)"
    },
    {
      "album-name": "Thriller",
      "release-date": "11/30/1982",
      "worldwide-sales": 66000000,
      year: 1982,
      color: "rgb(255, 0, 0)"
    },
    {
      "album-name": "Bad",
      "release-date": "09/01/1987",
      "worldwide-sales": 35000000,
      year: 1987,
      color: "rgb(105,105,105)"
    },
    {
      "album-name": "Dangerous",
      "release-date": "11/26/1991",
      "worldwide-sales": 32000000,
      year: 1991,
      color: "rgb(0, 82, 173)"
    },
    {
      "album-name": "HIStory: Past, Present and Future, Book I",
      "release-date": "06/20/1995",
      "worldwide-sales": 22000000,
      year: 1995,
      color: "rgb(165,0,0)"
    },
    {
      "album-name": "Invincible",
      "release-date": "10/30/2001",
      "worldwide-sales": 6000000,
      year: 2001,
      color: "rgb(177, 198, 191)"
    },
    {
      "album-name": "Michael",
      "release-date": "06/25/2009",
      "worldwide-sales": 541000,
      year: 2009,
      color: "rgb(255,174,66)"
    },
    {
      "album-name": "Xscape",
      "release-date": "12/10/2010",
      "worldwide-sales": 1700000,
      year: 2010,
      color: "rgb(0,0,128)"
    }
  ],
  beatles: [
    {
      "album-name": "Please Please Me",
      "release-date": "03/22/1963",
      "worldwide-sales": 1000000,
      year: 1963,
      color: "rgb(247, 255, 45)"
    },
    {
      "album-name": "With the Beatles",
      "release-date": "11/22/1963",
      "worldwide-sales": 500000,
      year: 1963,
      color: "rgb(105,105,105)"
    },
    {
      "album-name": "A Hard Day's Night",
      "release-date": "07/10/1964",
      "worldwide-sales": 4000000,
      year: 1964,
      color: "rgb(0,0,255)"
    },
    {
      "album-name": "Beatles for Sale",
      "release-date": "12/04/1964",
      "worldwide-sales": 1000000,
      year: 1964,
      color: "rgb(210,180,140)"
    },
    {
      "album-name": "Help!",
      "release-date": "08/06/1965",
      "worldwide-sales": 3000000,
      year: 1965,
      color: "rgb(0,0,128)"
    },
    {
      "album-name": "Rubber Soul",
      "release-date": "12/03/1965",
      "worldwide-sales": 6000000,
      year: 1965,
      color: "rgb(216, 81, 0)"
    },
    {
      "album-name": "Revolver",
      "release-date": "08/05/1966",
      "worldwide-sales": 5000000,
      year: 1966,
      color: "rgb(169,169,169)"
    },
    {
      "album-name": "Sgt. Pepper's Lonely Hearts Club Band",
      "release-date": "05/26/1967",
      "worldwide-sales": 11000000,
      year: 1967,
      color: "rgb(0,191,255)"
    },
    {
      "album-name": "The Beatles (White Album)",
      "release-date": "11/22/1968",
      "worldwide-sales": 24000000,
      year: 1968,
      color: "rgb(220,220,220)"
    },
    {
      "album-name": "Yellow Submarine",
      "release-date": "01/13/1969",
      "worldwide-sales": 1000000,
      year: 1969,
      color: "rgb(255,174,66)"
    },
    {
      "album-name": "Abbey Road",
      "release-date": "09/26/1969",
      "worldwide-sales": 12000000,
      year: 1969,
      color: "rgb(51,103,57)"
    },
    {
      "album-name": "Let It Be",
      "release-date": "05/08/1970",
      "worldwide-sales": 4000000,
      year: 1970,
      color: "rgb(225, 27, 34)"
    }
  ],
  queen: [
    {
      "album-name": "Queen",
      "release-date": "07/13/1973",
      "worldwide-sales": 600000,
      year: 1973,
      color: "rgb(255, 140, 0)"
    },
    {
      "album-name": "Queen II",
      "release-date": "03/08/1974",
      "worldwide-sales": 800000,
      year: 1974,
      color: "rgb(145, 145, 145)"
    },
    {
      "album-name": "Sheer Heart Attack",
      "release-date": "11/08/1974",
      "worldwide-sales": 4200000,
      year: 1974,
      color: "rgb(44, 64, 93)"
    },
    {
      "album-name": "A Night At The Opera",
      "release-date": "11/21/1975",
      "worldwide-sales": 4200000,
      year: 1975,
      color: "rgb(13, 25, 18)"
    },
    {
      "album-name": "A Day at the Races",
      "release-date": "12/10/1976",
      "worldwide-sales": 1500000,
      year: 1976,
      color: "rgb(37, 0, 136)"
    },
    {
      "album-name": "News of the World",
      "release-date": "10/28/1977",
      "worldwide-sales": 5500000,
      year: 1977,
      color: "rgb(152, 97, 54)"
    },
    {
      "album-name": "Jazz",
      "release-date": "11/10/1978",
      "worldwide-sales": 1600000,
      year: 1978,
      color: "rgb(69, 69, 69)"
    },
    {
      "album-name": "The Game",
      "release-date": "06/30/1980",
      "worldwide-sales": 4500000,
      year: 1980,
      color: "rgb(66, 54, 48)"
    },
    {
      "album-name": "Flash Gordon",
      "release-date": "12/08/1980",
      "worldwide-sales": 400000,
      year: 1980,
      color: "rgb(119, 129, 92)"
    },
    {
      "album-name": "Hot Space",
      "release-date": "05/21/1982",
      "worldwide-sales": 600000,
      year: 1982,
      color: "rgb(34, 50, 49)"
    },
    {
      "album-name": "The Works",
      "release-date": "02/27/1984",
      "worldwide-sales": 1500000,
      year: 1984,
      color: "rgb(169, 139, 24)"
    },
    {
      "album-name": "A Kind of Magic",
      "release-date": "06/02/1986",
      "worldwide-sales": 2200000,
      year: 1986,
      color: "rgb(158, 123, 108)"
    },
    {
      "album-name": "The Miracle",
      "release-date": "05/22/1989",
      "worldwide-sales": 1500000,
      year: 1989,
      color: "rgb(127, 139, 140)"
    },
    {
      "album-name": "Innuendo",
      "release-date": "02/05/1991",
      "worldwide-sales": 2500000,
      year: 1991,
      color: "rgb(12, 12, 54)"
    },
    {
      "album-name": "Made in Heaven",
      "release-date": "11/06/1995",
      "worldwide-sales": 5500000,
      year: 1991,
      color: "rgb(99, 8, 134)"
    }
  ]
};

const margin = { top: 30, right: 40, bottom: 40, left: 190 };
const width = 600;
const height = 300;

var yScale;
var xScale;

var albumToColorMap = new Map();

class HorizontalBarChart extends D3Component {
  initialize(node, props) {
    const { artist, step, years } = props;
    const data = this.getData(artist, step, years);

    // create color scale
    /*var colorScale = this.props.colors;
          console.log("COLORRRRRRRRRR"colorScale)
    //var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var i = 0;
    this.getAlbumNames(this.getAllData(artist)).forEach(function(d) {
      console.log("COLORRRRRRRRRR", d, colorScale[i])
      albumToColorMap.set(d, colorScale[i]);
      i += 1;
    });*/

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
      .attr("height", yScale.bandwidth())
      .attr("fill", function(d) {
        d["color"];
      });

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
      .call(d3.axisBottom(xScale).ticks(5));

    // Append the x-axis label
    this.svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.bottom) + ")"
      )
      .style("text-anchor", "middle")
      .text("Total Confirmed Worldwide Album Sales");

    // Append the chart title
    this.svg
      .append("text")
      .attr("transform", "translate(" + width / 2 + " ," + 0 + ")")
      .style("text-anchor", "middle")
      .text("Album Sales");

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
    var xAxis = d3.axisBottom(xScale).ticks(5);
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
      })
      .attr("fill", function(d) {
        return d["color"];
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
    //console.log("getData called with", artist, step, years);
    if (!(artist in allData)) {
      return [];
    }
    let res = [];
    for (let i = 0; i < allData[artist].length; i++) {
      if (allData[artist][i]["year"] <= years[step]) {
        res.push(allData[artist][i]);
      }
    }

    return res;
  }

  // Returns a json object with the data for the seleted artist
  getAllData(artist) {
    //console.log("getAllData called with", artist);
    if (!(artist in allData)) {
      return [];
    }
    let res = [];
    for (let i = 0; i < allData[artist].length; i++) {
      res.push(allData[artist][i]);
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

  /*getAllAlbumNames(data) {
    return this.
  }*/

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
    //console.log("extractData(" + key + ")", data, res);
    return res;
  }
}

module.exports = HorizontalBarChart;