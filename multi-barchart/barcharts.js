// TestData
var data = [ {
	"date" : "01.01.2000",
	"A" : 12,
	"B" : 20,
	"C" : 30
}, {
	"date" : "02.01.2000",
	"A" : 68,
	"B" : 50,
	"C" : 30
}, {
	"date" : "03.01.2000",
	"A" : 24,
	"B" : 30,
	"C" : 30
}, {
	"date" : "05.01.2000",
	"A" : 8,
	"B" : 10,
	"C" : 30
}, {
	"date" : "06.01.2000",
	"A" : 94,
	"B" : 80,
	"C" : 30
} ];

// Parse Data
var graphNames = d3.keys(data[0]).filter(function(key) {
	return key !== "date";
});

data.forEach(function(d) {
	d.graphs = graphNames.map(function(name) {
		return {
			name : name,
			value : +d[name]
		};
	});
});

// Define svg size
var margin = {
	top : 20,
	right : 20,
	bottom : 30,
	left : 40
}, width = 960 - margin.left - margin.right, height = 500 - margin.top
		- margin.bottom;

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var barspacing = 10;

var x0 = d3.scaleBand().domain(data.map(function(d) {
		return d.date;
	})).range([ 0, width ]);

var x1 = d3.scaleBand().domain(graphNames).range([ 0 + barspacing, x0.bandwidth() - barspacing ]);;

var y = d3.scaleLinear().domain([ 0, d3.max(data, function(d) {
	return d3.max(d.graphs, function(d) {
		return d.value;
	});
}) ]).range([ height, 0 ]);

var color = d3.scaleOrdinal([ "#98abc5", "#8a89a6", "#7b6888", "#6b486b",
		"#a05d56", "#d0743c", "#ff8c00" ]);

var xAxis = d3.axisBottom(x0);

var yAxis = d3.axisLeft(y);

var svg = d3.select("body").append("svg").attr("width",
		width + margin.left + margin.right).attr("height",
		height + margin.top + margin.bottom).append("g").attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");




svg.append("g").attr("class", "x axis").attr("transform",
		"translate(0," + height + ")").call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr(
		"transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style(
		"text-anchor", "end").text("Population");

var date = svg.selectAll(".date").data(data).enter().append("g").attr(
		"class", "date").attr("transform", function(d) {
	return "translate(" + x0(d.date) + ",0)";
});

date.selectAll("rect").data(function(d) {
	return d.graphs;
}).enter().append("rect").attr("width", x1.bandwidth()).attr("x", function(d) {
	return x1(d.name);
}).attr("y", function(d) {
	return y(d.value);
}).attr("height", function(d) {
	return height - y(d.value);
}).style("fill", function(d) {
	return color(d.name);
}).on("mouseover", function(d) {
	div.transition()        
       .duration(200)      
       .style("opacity", .9);      
    div.html(d.name + "<br/>"  + d.value)  
       .style("left", (d3.event.pageX) + "px")     
       .style("top", (d3.event.pageY - 28) + "px");                
}).on("mouseout", function(d) {       
    div.transition()        
       .duration(500)      
       .style("opacity", 0);   
});

var legend = svg.selectAll(".legend").data(graphNames.slice().reverse()).enter()
		.append("g").attr("class", "legend").attr("transform", function(d, i) {
			return "translate(0," + i * 20 + ")";
		});

legend.append("rect").attr("x", width - 18).attr("width", 18)
		.attr("height", 18).style("fill", color);

legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em")
		.style("text-anchor", "end").text(function(d) {
			return d;
		});
