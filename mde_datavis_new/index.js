var width = 960,
    height = 480,
    radius = 6,
    fill = "rgba(255, 49, 255, 0.388)",
    stroke = "rgba(0, 0, 0, 0.5)",
    strokeWidth = 0.1;

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 20])
  .on("zoom", zoomed);

var g = svg.append("g");

// This invisible rect catches events for the zooming interaction.
var rect = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .call(zoom);

g.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);
  
function zoomed(){
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json", function(error, world) {
  if (error) throw error;
  g.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  g.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

  var features = topojson.feature(world, world.objects.countries).features;
  var centroids = features.map(function (feature){
    return path.centroid(feature);
  });

  g.selectAll(".centroid").data(centroids)
    .enter().append("circle")
      .attr("class", "centroid")
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("r", radius)
      .attr("cx", function (d){ return d[0]; })
      .attr("cy", function (d){ return d[1]; });

});
function type(d){
  
  // This should actually be [d.longitude, d.latitude]
  // It looks like these are reversed in the data.
  d.projected = projection([d.latitude, d.longitude]);
  return d;
}
  
d3.select(self.frameElement).style("height", height + "px");
