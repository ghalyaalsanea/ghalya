//Setting up the SVG where we'll be appending everything for our chart
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 10, left: 50, right: 50, bottom: 50 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let selected;
let dataset = "import";

d3.select("#cotton").on("click", function() {
    selected = "raw_cotton";
    Update();
});
d3.select("#linen").on("click", function() {
    selected = "raw_linen";
    Update();
});
d3.select("#silk").on("click", function() {
    selected = "raw_silk";
    Update();
});
d3.select("#wool").on("click", function() {
    selected = "raw_wool";
    Update();
});
d3.select("#synthetic").on("click", function() {
    selected = "raw_synthetic";
    Update();
});


d3.select("#import").on("click", function() {
    dataset = "import";
    Update();
});

d3.select("#export").on("click", function() {
    dataset = "export";
    Update();
});

Update();

function Update() {


    d3.csv("./data/US_Textile_Fiber_Trade.csv", parse).then(function (data) {
        document.getElementById("title").innerHTML = dataset + " 2020";


        let color = d3.scaleOrdinal([selected], ["#fe6d73"]).unknown("#ccc");
    
        /* filter subset of data, grabbing only the rows where its import and 2020 */
        const filtered = data.filter(d => d.import_export === dataset && d.year === 2020);
        const smallDataset = [];
        for(let i = 0; i < filtered.length; i++) {
            smallDataset.push({
                fiber_type: filtered[i].fiber_type,
                category: filtered[i].category,
                sub_category: filtered[i].sub_category,
                value: filtered[i].value
            })
        }
        // console.log(smallDataset)
    
        let keys = ["fiber_type", "category", "sub_category"]
        
        let index = -1;
        const NODES = [];
        const nodeByKey = new Map;
        const indexByKey = new Map;
        const LINKS = [];
    
        for (const k of keys) {
            for (const d of smallDataset) {
            const key = JSON.stringify([k, d[k]]);
            if (nodeByKey.has(key)) continue;
            const node = {name: d[k]};
            NODES.push(node);
            nodeByKey.set(key, node);
            indexByKey.set(key, ++index);
            }
        }
    
        // console.log(nodes)
    
        for (let i = 1; i < keys.length; ++i) {
            const a = keys[i - 1];
            const b = keys[i];
            const prefix = keys.slice(0, i + 1);
            const linkByKey = new Map;
            for (const d of smallDataset) {
              const names = prefix.map(k => d[k]);
              const key = JSON.stringify(names);
              const value = d.value || 1;
              let link = linkByKey.get(key);
              if (link) { link.value += value; continue; }
              link = {
                source: indexByKey.get(JSON.stringify([a, d[a]])),
                target: indexByKey.get(JSON.stringify([b, d[b]])),
                names,
                value
              };
              LINKS.push(link);
              linkByKey.set(key, link);
            }
          }
    
        // console.log(links)
    
        sankey = d3.sankey()
            .nodeSort(null)
            .linkSort(null)
            .nodeWidth(8)
            .nodePadding(10)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);
    
        const {nodes, links} = sankey({
            nodes: NODES.map(d => Object.assign({}, d)),
            links: LINKS.map(d => Object.assign({}, d))
        });

        svg.selectAll("g").remove();

    
        let N = svg.append("g")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
            .attr("fill", "black")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .append("title")
            .text(d => `${d.name}\n${d.value.toLocaleString()}`);
    
        let L = svg.append("g")
            .attr("class", "area")
            .attr("fill", "none")
            .selectAll("g")
            .data(links)
            .join("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", d => color(d.names[0]))
            // .attr("stroke-opacity", 0.7)
            .attr("stroke-width", d => d.width)
            .style("mix-blend-mode", "multiply")
            .append("title")
            .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);
    
        let T = svg.append("g")
            .style("font", "10px sans-serif")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name)
            .append("tspan")
            .attr("fill-opacity", 0.7)
            .text(d => ` ${d.value.toLocaleString()}`);
        
    });
}

//get the data in the right format
function parse(d) {
    return {
        fiber_type: d.fiber_type, //cotton, silk, wool, etc.
        import_export: d.import_export, //this is a binary value
        category: d.category, //yarn, apparel, home, etc.
        sub_category: d.sub_category, //type of yarn, type of home
        year: +d.year, //we want this as a number
        month: +d.month, //we want this as a number
        value: +d.value //we want this as a number
    }
}

