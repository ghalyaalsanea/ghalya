//Setting up the SVG where we'll be appending everything for our chart
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 150, right: 50, bottom: 150 };

// const projection = d3.geoEqualEarth();
// const path = d3.geoPath(projection);



const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)



d3.csv("./data/complete_data.csv", function (data) {
    world = FileAttachment("world.json").json()

    chart = Choropleth(hale, {
        id: d => d.country, // country name, e.g. Zimbabwe
        value: d => d.value, 
        range: d3.interpolateYlGnBu,
        features: countries,
        featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
        borders: countrymesh,
        projection: d3.geoEqualEarth(),
        width
    })
})
    

//     /* filter subset of data, grabbing only the rows where the country = China */
//     const filtered_imports = data.filter(d => d.import_export === "import" && d.fiber_type === "raw_silk" && d.year === 2020);
//     const filtered_exports = data.filter(d => d.import_export === "export" && d.fiber_type === "raw_silk" && d.year === 2020);

//     let nested_import = d3.nest()
//         .key(d => d.month)
//         .rollup(d => d3.sum(d, g => g.value))
//         .entries(filtered_imports);
//     nested_import.forEach(d => d.key = +d.key);

//     let nested_export = d3.nest()
//         .key(d => d.month)
//         .rollup(d => d3.sum(d, g => g.value))
//         .entries(filtered_exports);
//     nested_export.forEach(d => d.key = +d.key);    

//     //scales: we'll use a band scale for the bars
//     const xScaleI = d3.scaleBand()
//         .domain(nested_import.map(d => d.key))
//         .range([margin.left, width - margin.right])
//         .padding(0.1);

//     const yScaleI = d3.scaleLinear()
//         .domain([0, d3.max(nested_import, d => d.value)])
//         .range([height/2, margin.top]);

//     //scales: we'll use a band scale for the bars
//     const xScaleE = d3.scaleBand()
//         .domain(nested_export.map(d => d.key))
//         .range([margin.left, width - margin.right])
//         .padding(0.1);

//     const yScaleE = d3.scaleLinear()
//         .domain([d3.max(nested_export, d => d.value), 0])
//         .range([height/2, margin.bottom]);
//     // const yScaleE = d3.scaleLinear()
//     //     .domain([0, d3.max(nested_export, d => d.value)])
//     //     .range([margin.bottom, height/2]);


//     /*making the bars in the barchart:
//     uses filtered data
//     defines height and width of bars
//     */

//     let barI = svg.selectAll(".importBars")
//         .data(nested_import)
//         .enter()
//         .append("rect")
//         .attr("class", "importBars")
//         .attr("x", d => xScaleI(d.key))
//         .attr("y", d => yScaleI(d.value))
//         .attr("width", xScaleI.bandwidth())
//         .attr("height", d => height/2 - yScaleI(d.value))
//         .attr("fill", "black");

//     let barE = svg.selectAll(".exportBars")
//         .data(nested_export)
//         .enter()
//         .append("rect")
//         .attr("class", "exportBars")
//         .attr("x", d => xScaleE(d.key))
//         .attr("y", d => height/2)
//         .attr("width", xScaleE.bandwidth())
//         .attr("height", d => yScaleE(d.value) - margin.bottom)
//         .attr("fill", "blue");
    
//     const xAxis = svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", `translate(0,${height/2})`)
//         .call(d3.axisBottom().scale(xScaleI).tickFormat(d3.format("Y")));

//     const yAxisI = svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", `translate(${margin.left},0)`)
//         .call(d3.axisLeft().scale(yScaleI)
//         .tickFormat(d3.format(".2s"))
//         );
    
//     const yAxisE = svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", `translate(${margin.left},${height/2 - margin.bottom})`)
//         .call(d3.axisLeft().scale(yScaleE)
//         .tickFormat(d3.format(".2s"))
//         );

//     // const xAxisLabel = svg.append("text")
//     //     .attr("class", "axisLabel")
//     //     .attr("x", width / 2)
//     //     .attr("y", height / 2)
//     //     .text("MONTH");

//     const yAxisLabel = svg.append("text")
//         .attr("class", "axisLabel")
//         .attr("transform", "rotate(-90)")
//         .attr("x", -height / 2)
//         .attr("y", margin.left / 2)
//         .text("amount");
    
//     const yAxisLabelI = svg.append("text")
//         .attr("class", "axisLabel")
//         .attr("transform", "rotate(-90)")
//         .attr("x", -height / 4)
//         .attr("y", margin.left / 2)
//         .text("IMPORT");

//     const yAxisLabelE = svg.append("text")
//         .attr("class", "axisLabel")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 3*-height / 4)
//         .attr("y", margin.left / 2)
//         .text("EXPORT");
// })
