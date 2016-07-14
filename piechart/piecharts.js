// TestData
var data = [ {
	"name" : "A",
	"value" : 12
}, {
	"name" : "B",
	"value" : 32
}, {
	"name" : "C",
	"value" : 42
}, {
	"name" : "D",
	"value" : 64
}, {
	"name" : "E",
	"value" : 83
} ];

	/*
	 * Bounds of component.
	 */
	var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;
	
	/*
	 * Create svg element.
	 */
	var svg = d3.select("body").append("svg")
		.attr("id", "piechart")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var div = d3.select("body").append("div")   
    			.attr("class", "tooltip")               
      			.style("opacity", 0);
	
	
	/*
	 * Color of pie-parts.
	 */
	var color = d3.scaleOrdinal()
    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	/*
	 * Define pie arc.
	 */
	var arc = d3.arc()
    	.outerRadius(radius - 40)
    	.innerRadius(0);

	/*
	 * Define ring for labels. The radius of the label arc is 30 bigger, so it's outside of the pie.
	 */
	var labelArc = d3.arc()
    	.outerRadius(radius - 10)
    	.innerRadius(radius - 10);

	/*
	 * Generate pie.
	 */
	var pie = d3.pie()
    	.sort(null)
    	.value(function(d) { return d.value; });

	/*
	 * Apply pie data on svg.
	 * 
	 */
	var g = svg.selectAll(".arc")
    	.data(pie(data))
    	.enter().append("g")
    	.attr("class", "arc");

	/*
	 * Apply color to pie.
	 */
	g.append("path")
    	.attr("d", arc)
    	.style("fill", function(d) { return color(d.data.name); })
    	.on("mouseover", function(d) {
			div.transition()        
       		   .duration(200)      
               .style("opacity", .9);      
    		div.html(d.data.name + "<br/>"  + d.value)  
       		   .style("left", d3.event.pageX + "px")     
       		   .style("top", d3.event.pageY + "px");                
		}).on("mouseout", function(d) {       
    		div.transition()        
       		   .duration(500)      
               .style("opacity", 0);   
		});

	/*
	 * Apply labels to svg.
	 */
	g.append("text")
    	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    	.attr("dy", 5)
    	.style("text-anchor", "middle")
    	.text(function(d) { return d.data.name; });


	function type(d) {
		d.value = +d.value;
		return d;
	}