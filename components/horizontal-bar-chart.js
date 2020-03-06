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
      "worldwide-sales": 1148000
    }
  ]
};

class HorizontalBarChart extends D3Component {
  getData(artist, to) {
    console.log("getData called with", artist, to);
    if (!(artist in allData)) {
      return [];
    }
    return allData[artist].slice(0, to);
  }

  initialize(node, props) {
    this.svg = d3
      .select(node)
      .append("svg")
      .attr("font-family", "sans-serif");
    return this.svg.node();
  }

  update(props) {
    console.log("update", props);
    const { artist, to } = props;
    if (artist === "start") {
      return this.svg.node();
    }
    const data = this.getData(artist, to);
    const margin = { top: 30, right: 40, bottom: 10, left: 50 };
    const barHeight = 25;
    const width = 600;
    const height =
      Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;

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

    const bar = this.svg
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i)})`);

    bar
      .append("rect")
      .attr("fill", "black")
      .attr("x", x(0))
      .attr("width", d => x(d.sales) - x(0))
      .attr("height", y.bandwidth() - 1);

    this.svg.append("g").call(yAxis);
    this.svg.append("g").call(xAxis);

    return this.svg.node();
  }
}

module.exports = HorizontalBarChart;
