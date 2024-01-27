var treeCover;

$.getJSON('/web-projects/treecover-india/tree-cover.json', function(response) {
    treeCover = response;
});

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// console.log(w);
var width, height, scale, long, lat;
if (w >= 500) {
    width = 880,
        height = width / 800 * 950;
    scale = 1500;
    long = 85.5;
    lat = 30;
    rad = 1.15;
    stateFont = "1rem";
    capFont = "0.8rem";
    spacing = 12;
} else {
    width = w,
        height = width / 800 * 950;
    scale = 650;
    long = 109;
    lat = 19;
    rad = 2.5;
    stateFont = "0.7rem";
    capFont = "0.55rem";
    spacing = 7;
}


var projection = d3.geoMercator()
    .scale(scale)
    .center([long, lat]);

var path = d3.geoPath()
    .projection(projection);

svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("ind-topo.json", function(error, india) {
    if (error) return console.error(error);

    var states = topojson.feature(india, india.objects.states);

    svg.append("path")
        .datum(topojson.feature(india, india.objects.states))
        .attr("d", path)
        .attr("class", "state-borders");

    svg.selectAll(".states")
        .data(states.features)
        .enter().append("path")
        .attr("class", function(d) {
            return "states " + d.properties.HASC_1;
        })
        .attr("d", path);
});

function drawMap(e, rawYear) {

    if (rawYear) {
      mapYear = rawYear;
    } else {
      mapYear = e.target.getAttribute("data-year");
    }

    if (svg) svg.remove();

    svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("ind-topo.json", function(error, india) {
        if (error) return console.error(error);

        var states = topojson.feature(india, india.objects.states);

        svg.append("path")
            .datum(topojson.feature(india, india.objects.states))
            .attr("d", path)
            .attr("class", "state-borders");

        svg.selectAll(".states")
            .data(states.features)
            .enter().append("path")
            .attr("class", function(d) {
                return "states " + d.properties.HASC_1;
            })
            .attr("d", path);
        // console.log(states);
        var centroids = states.features.map(function(feature) {
            var coordinates = path.centroid(feature);
            var mapJSON = eval(`treeCover.india${mapYear}`);
            var radius = Math.sqrt(mapJSON[feature.properties.HASC_1] / Math.PI) / rad;
            svg.append("circle")
                .attr("cx", coordinates[0])
                .attr("cy", coordinates[1])
                .attr("r", radius)
                .attr("class", "circles");
            stateAbbr = feature.properties.HASC_1;
            svg.append("text")
                .attr("x", coordinates[0] - radius * 0.4)
                .attr("y", coordinates[1])
                .text(stateAbbr)
                .attr("font-size", stateFont)
                .attr("fill", "black");
            treeArea = mapJSON[feature.properties.HASC_1];
            svg.append("text")
                .attr("x", coordinates[0] - radius * 0.4)
                .attr("y", coordinates[1] + spacing)
                .text(treeArea)
                .attr("font-size", capFont)
                .attr("fill", "black");
        });


    });
}

const buttons = document.querySelectorAll('.button');
// buttons.forEach(button => button.addEventListener('mouseenter', drawMap));
buttons.forEach(button => button.addEventListener('click', drawMap));

// First draw
setTimeout( 'drawMap(NaN, 2009)', 500 );
