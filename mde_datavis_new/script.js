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

d3.json("https://github.com/ghalyaalsanea/ghalya/blob/2fe8a6502d35e270ccbc5efa48d78ff77b8fa826/mde_datavis_new/script.js#L49", function(error, world) {
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


// d3.json("world_new.json", function(world) {
//     d3.csv("complete_data.csv", function(data) {
//         console.log(data)

//         land = topojson.feature(world, world.objects.land)
//         graticule = d3.geoGraticule10()

//         outline = ({type: "Sphere"})
//         width = 800
//         height = 600
//         projection = d3.geoNaturalEarth1()
//         path = d3.geoPath(projection)

//         console.log(data)

//         const svg = d3.create("svg")
//             .attr("viewBox", [0, 0, width, height]);

//         const defs = svg.append("defs");

//         defs.append("path")
//             .attr("id", "outline")
//             .attr("d", path(outline));

//         defs.append("clipPath")
//             .attr("id", "clip")
//             .append("use")
//             .attr("xlink:href", new URL("#outline", location));

//         const g = svg.append("g")
//             .attr("clip-path", `url(${new URL("#clip", location)})`);

//         g.append("use")
//             .attr("xlink:href", new URL("#outline", location))
//             .attr("fill", "#fff");

//         g.append("path")
//             .attr("d", path(graticule))
//             .attr("stroke", "#ddd")
//             .attr("fill", "none");

//         g.append("path")
//             .attr("d", path(land))
//             .attr("fill", "#ddd");

//         svg.append("use")
//             .attr("xlink:href", new URL("#outline", location))
//             .attr("stroke", "#000")
//             .attr("fill", "none");
            
//         return svg.node(); 
//     });
// });
// svg.node();

// // Find the centroid of the largest polygon
// centroid = (feature) => {
//     const geometry = feature.geometry;
//     if (geometry.type === "Polygon"){
//       return d3.geoCentroid(feature);
//     }
//     else {
//       let largestPolygon = {}, largestArea = 0;
//       geometry.coordinates.forEach(coordinates => {
//         const polygon = { type: "Polygon", coordinates },
//               area = d3.geoArea(polygon);
//         if (area > largestArea) {
//           largestPolygon = polygon;
//           largestArea = area;
//         }
//       });
//       return d3.geoCentroid(largestPolygon);
//     }
//   }

// r = d3.scaleSqrt()
//     .domain([0, d3.max(world.features, d => d.properties.POP_EST)])
//     .range([0, Math.sqrt(width * height) / 10])


// import { legendCircle } from "@harrystevens/circle-legend";
// import { toc } from "@harrystevens/toc";

// projection = d3.geoEqualEarth()
//     .rotate([-10, 0, 0])
//     .fitSize([width, height], { type: "Sphere" });


// path = d3.geoPath(projection);
// height = width * .49;
// simulation = d3.forceSimulation(world.features)
//     .force("x", d3.forceX(d => projection(d.centroid)[0]))
//     .force("y", d3.forceY(d => projection(d.centroid)[1]))
//     .force("collide", d3.forceCollide(d => 1 + r(d.properties.POP_EST)))
//     .stop();


// legend = legendCircle()
//     .tickValues([50e6, 200e6, 500e6, 1000e6])
//     .tickFormat((d, i, e) => {
//       const val = d >= 1e9 ? `${d / 1e9}B` : `${d / 1e6}M`;
//       const unit = i === e.length - 1 ? " people" : "";
//       return `${val}${unit}`;
//     })
//     .scale(r);


// world = {
//     const topo : await FileAttachment("./world.json").json();
//     const geo = topojson.feature(topo, topo.objects.ne_110m_admin_0_countries_lakes);
//     geo.features.forEach(feature => {
//       feature.centroid = centroid(feature);
//       return feature;
//     });
//     return geo;
//   }









