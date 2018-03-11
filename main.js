function Stage() {
  this.N = 20000;
  this.radius = 1.5;
  this.periodFactor = 1;

  this.content = document.getElementById("content");

  this.tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var gui = new dat.GUI();
  this.gui = gui;

  gui.add(this, "N").min(2);
  gui.add(this, "radius");
  gui.add(this, "periodFactor");
  this.mode = 1;
  gui.add(this, "mode", { "prime numbers": 1, "natural numbers": 2 });
  gui.add(this, "recalculate");

  this.render();
}

Stage.prototype.recalculate = function() {
  this.clear();
  this.render();
}

Stage.prototype.clear = function() {
  var content = this.content;
  while (content.firstChild) content.removeChild(content.firstChild);
}

Stage.prototype.render = function() {
  var dim = Math.min(window.innerWidth, window.innerHeight);

  var wmargin = 15;
  var hmargin = 15;
  var wtotal = dim - 4;
  var htotal = dim - 4;
  var wimg = wtotal - wmargin * 2;
  var himg = htotal - hmargin * 2;
  var r = this.radius;

  var periodFactor = this.periodFactor;

  var tooltip = this.tooltip;

  var source;
  if (this.mode === 1) {
    source = eratosthenes(this.N);
  }
  else {
    source = [];
    for (var i=0; i<this.N; i++) source.push(i+1);
  }

  var indices = [];

  var ns = source.length;
  for (var i = 0; i < ns; i++) indices.push(i+1);

  var data = [];

  // data is a set of (x,y) tuples
  for (var i=0; i<ns; i++) {
    var p = source[i];
    var idx = indices[i] * periodFactor;

    data.push({
      x: p * Math.cos(idx),
      y: p * Math.sin(idx),
      i: i
    });
  }

  var xv = function(d) { return d.x; };
  var yv = function(d) { return d.y; };

  var xmax = d3.max(data, xv);
  var ymax = d3.max(data, yv);
  var xmin = d3.min(data, xv);
  var ymin = d3.min(data, yv);

  var xs = d3
    .scaleLinear()
    .domain([xmin, xmax])
    .range([wmargin, wimg + wmargin]);
  var ys = d3
    .scaleLinear()
    .domain([ymin, ymax])
    .range([hmargin, himg + hmargin]);

  var fx = function(d) { return xs(d.x); }
  var fy = function(d) { return ys(d.y); }

  var svg = d3
    .select("#content")
    .append("svg")
    .attr("width", wtotal)
    .attr("height", htotal);

  var points = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", fx)
    .attr("cy", fy)
    .attr("r", r)
    .style("fill", "black")
    .on("mouseover", function(d) {
      tooltip
        .transition()
        .duration(0)
        .style("opacity", 1);
      tooltip
        .html(
          "value: " + source[d.i] + "<br/>" +
          "index: " + d.i
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(0)
        .style("opacity", 0);
    });
}

var stage = new Stage();

function eratosthenes(n) {
  var primes = [];
  var n1 = n + 1;

  for (var i = 0; i < n1; i++) primes.push(i);

  var m = 2;
  while (m < n1) {
    if (primes[m] != 0) {
      var j = m * 2;
      while (j < n1) {
        primes[j] = 0;
        j += m;
      }
    }
    m++;
  }

  var result = [];

  for (var i = 2; i < n1; i++) {
    var p = primes[i];
    if (p > 0) result.push(p);
  }

  return result;
}
