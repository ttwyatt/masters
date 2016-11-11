function interactivewrapper() {
	
	 //Intialize scrollspy
	 $('body').scrollspy({ target: '.navbar' });

	 //store window dimensions
	 var windowwidth = $(window).width();

	//set timing in MS of transitions
	var timer = 750;

	//sets bisectDate for callout calcuations
	var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

	//Comma formatter
	var commaformat = d3.format(",");

	//Comma formatter
	var monthFormat = d3.time.format( "%b. %Y" );

	//Throttler for window resizing
	function throttle (callback, limit) {
	    var wait = false;                 // Initially, we're not waiting
	    return function () {              // We return a throttled function
	        if (!wait) {                  // If we're not waiting
	            callback.call();          // Execute users function
	            wait = true;              // Prevent future invocations
	            setTimeout(function () {  // After a period of time
	                wait = false;         // And allow future invocations
	            }, limit);
	        }
	    }
	};

	function refreshbuttons() {
		d3.selectAll(".btn.active")
		.classed("active",false);
		d3.select("#cityunemploybutton")
		.classed("active",true);
		d3.select("#citysalesbutton")
		.classed("active",true);
		d3.select("#cityrentbutton")
		.classed("active",true);
		d3.select("#ELAbarbutton")
		.classed("active",true);
		d3.select("#allscatterbutton")
		.classed("active",true);
		d3.select("#allcrimebutton")
		.classed("active",true);
	};

	//Set up charts and chart methods
	var charts = {
		draw: function(){
			charts.intromap();
			charts.unemployline();
			charts.jobsline();
			charts.eduline();
			charts.edubars();
			charts.eduscatter();
			charts.homelessline();
			charts.mediansalesline();
			if (windowwidth > 767) { charts.mediansaleslinecontext();}
			if (windowwidth > 767) { charts.medianrentlinecontext();}
			charts.medianrentline();
			charts.crimeline();
		},

		redraw: function(){
			charts.empty();
			charts.draw();
		},

		empty: function (){
			$('#intromap').empty();
			$('#unemploychart').empty();
			$('#jobschart').empty();
			$('#gradratechart').empty();
			$('#eduscatter').empty();
			$('#educitywidebar').empty();
			$('#edumanhattanbar').empty();
			$('#edubrooklynbar').empty();
			$('#edubronxbar').empty();
			$('#eduqueensbar').empty();
			$('#edustatensbar').empty();
			$('#homelesschart').empty();
			$('#mediansales').empty();
			$('#mediansalescontext').empty();
			$('#medianrent').empty();
			$('#medianrentcontext').empty();
			$('#crimechart').empty();
		},	

		intromap: function() {
			// set container dimensions
			var $container = $('#intromap');
			var containerwidth = $container.width();
			var containerheight = $container.width();


			//Set bar container dimensions
			var $barcontainer = $('#samplebar');
			var barcontainerwidth = $barcontainer.width();

			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 0, bottom: 0, left: 0 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			// create svg
			var svg = d3.select("#intromap")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//define map projection
			var projection = d3.geo.mercator()
			   .center([ -73.978, 40.706 ])
			   .translate([ width/2, height/2 ])
			   .scale([ width * 102.5 ]);

			//Define path generator
			var path = d3.geo.path()
				.projection(projection);

			//create bar scale
			var widthscale = d3.scale.linear()
				.range([0, barcontainerwidth])
				.domain([0, 100]);

			//load data
			d3.csv("data/mapdata.csv", function(data) {

				d3.json("data/boroughsmpl.json", function(geo) {
					
					for (var i = 0; i < data.length; i++) {
						
						var databoroname = data[i].boro_name;
						var fifteenpop = data[i].fifteenpop;
						var fortypop = data[i].fortypop;
						var racewhite = data[i].racewhite;
						var raceblack = data[i].raceblack;
						var racehispanic = data[i].racehispanic;
						var raceasian = data[i].raceasian;
						var eduhigh = data[i].eduhigh;
						var edubach = data[i].edubach;
						var incomemedian = data[i].incomemedian;
						var incomeweekly = data[i].incomeweekly;
						var incomepoverty = data[i].incomepoverty;

						for (var j = 0; j < geo.features.length; j++) {
							geoboroname = geo.features[j].properties.boro_name;

							if (databoroname == geoboroname) {
								geo.features[j].properties.fifteenpop = fifteenpop;
								geo.features[j].properties.fortypop = fortypop;
								geo.features[j].properties.racewhite = racewhite;
								geo.features[j].properties.raceblack = raceblack;
								geo.features[j].properties.racehispanic = racehispanic;
								geo.features[j].properties.raceasian = raceasian;
								geo.features[j].properties.eduhigh = eduhigh;
								geo.features[j].properties.edubach = edubach;
								geo.features[j].properties.incomemedian = incomemedian;
								geo.features[j].properties.incomeweekly = incomeweekly;
								geo.features[j].properties.incomepoverty = incomepoverty;
							}
						}
					}

					var citydataboroname = "New York City";
					var cityfifteenpop = 8550405;
					var cityfortypop = 9025145;
					var cityracewhite = 32.3;
					var cityraceblack = 22.3;
					var cityracehispanic = 29;
					var cityraceasian = 13.7;
					var cityeduhigh = 80.1;
					var cityedubach = 35;
					var cityincomemedian = 52737;
					var cityincomeweekly = 1262;
					var cityincomepoverty = 20.6;

					//Create default state of map sidebar
					function defaultintrolabels() {
						d3.select("#introlabel")
							.html(citydataboroname);
						d3.select("#fifteenpop")
							.html(commaformat(cityfifteenpop));
						d3.select("#fortypop")
							.html(commaformat(cityfortypop));
						d3.select("#racewhite")
							.html(cityracewhite +"%");
						d3.select("#raceblack")
							.html(cityraceblack +"%");
						d3.select("#racehispanic")
							.html(cityracehispanic +"%");
						d3.select("#raceasian")
							.html(cityraceasian +"%");	
						d3.select("#eduhigh")
							.html(cityeduhigh +"%");
						d3.select("#edubach")
							.html(cityedubach +"%");							
						d3.select("#incomemedian")
							.html(commaformat(cityincomemedian));
						d3.select("#incomeweekly")
							.html(commaformat(cityincomeweekly));
						d3.select("#incomepoverty")
							.html(cityincomepoverty +"%");
					}

					function defaultintrobars() {
						d3.select("#racewhitebar")
							.style("width", widthscale(cityracewhite) +"px");
						d3.select("#raceblackbar")
							.style("width", widthscale(cityraceblack) +"px");
						d3.select("#racehispanicbar")
							.style("width", widthscale(cityracehispanic) +"px");
						d3.select("#raceasianbar")
							.style("width", widthscale(cityraceasian) +"px");
						d3.select("#eduhighbar")
								.style("width", widthscale(cityeduhigh) +"px");
						d3.select("#edubachbar")
							.style("width", widthscale(cityedubach) +"px");																											
						d3.select("#incomepovertybar")
							.style("width", widthscale(cityincomepoverty) +"px");
					}

					defaultintrolabels();
					defaultintrobars();

					var boroughs = svg.selectAll("path")
					   .data(geo.features)
					   .enter()
					   .append("g")
			   			.on("mouseover", function(d) {
							d3.select("#introlabel")
								.html(d.properties.boro_name);
							d3.select("#fifteenpop")
								.html(commaformat(d.properties.fifteenpop));
							d3.select("#fortypop")
								.html(commaformat(d.properties.fortypop));
							d3.select("#racewhite")
								.html(d.properties.racewhite + "%");
							d3.select("#raceblack")
								.html(d.properties.raceblack + "%");
							d3.select("#racehispanic")
								.html(d.properties.racehispanic + "%");
							d3.select("#raceasian")
								.html(d.properties.raceasian + "%");	
							d3.select("#eduhigh")
								.html(d.properties.eduhigh + "%");
							d3.select("#edubach")
								.html(d.properties.edubach + "%");							
							d3.select("#incomemedian")
								.html("$" + commaformat(d.properties.incomemedian));
							d3.select("#incomeweekly")
								.html("$" + commaformat(d.properties.incomeweekly));
							d3.select("#incomepoverty")
								.html(d.properties.incomepoverty + "%");

							d3.select("#racewhitebar")
								.style("width", widthscale(d.properties.racewhite) +"px");
							d3.select("#raceblackbar")
								.style("width", widthscale(d.properties.raceblack) +"px");
							d3.select("#racehispanicbar")
								.style("width", widthscale(d.properties.racehispanic) +"px");
							d3.select("#raceasianbar")
								.style("width", widthscale(d.properties.raceasian) +"px");
							d3.select("#eduhighbar")
								.style("width", widthscale(d.properties.eduhigh) +"px");
							d3.select("#edubachbar")
								.style("width", widthscale(d.properties.edubach) +"px")	;																										
							d3.select("#incomepovertybar")
								.style("width", widthscale(d.properties.incomepoverty) +"px");

							d3.select(this)
							.selectAll("path")
							.classed ("borohighlight", true);
						})
			   			.on("touchstart", function(d) {
							d3.select("#introlabel")
								.html(d.properties.boro_name);
							d3.select("#fifteenpop")
								.html(commaformat(d.properties.fifteenpop));
							d3.select("#fortypop")
								.html(commaformat(d.properties.fortypop));
							d3.select("#racewhite")
								.html(d.properties.racewhite + "%");
							d3.select("#raceblack")
								.html(d.properties.raceblack + "%");
							d3.select("#racehispanic")
								.html(d.properties.racehispanic + "%");
							d3.select("#raceasian")
								.html(d.properties.raceasian + "%");	
							d3.select("#eduhigh")
								.html(d.properties.eduhigh + "%");
							d3.select("#edubach")
								.html(d.properties.edubach + "%");							
							d3.select("#incomemedian")
								.html("$" + commaformat(d.properties.incomemedian));
							d3.select("#incomeweekly")
								.html("$" + commaformat(d.properties.incomeweekly));
							d3.select("#incomepoverty")
								.html(d.properties.incomepoverty + "%");

							d3.select("#racewhitebar")
								.style("width", widthscale(d.properties.racewhite) +"px");
							d3.select("#raceblackbar")
								.style("width", widthscale(d.properties.raceblack) +"px");
							d3.select("#racehispanicbar")
								.style("width", widthscale(d.properties.racehispanic) +"px");
							d3.select("#raceasianbar")
								.style("width", widthscale(d.properties.raceasian) +"px");
							d3.select("#eduhighbar")
								.style("width", widthscale(d.properties.eduhigh) +"px");
							d3.select("#edubachbar")
								.style("width", widthscale(d.properties.edubach) +"px")	;																										
							d3.select("#incomepovertybar")
								.style("width", widthscale(d.properties.incomepoverty) +"px");

							d3.select(this)
							.selectAll("path")
							.classed ("borohighlight", true);
						})
			   			.on("mouseout", function(d) {
							defaultintrobars();
							defaultintrolabels();

							d3.select(this)
								.selectAll("path")
								.classed ("borohighlight", false);
						})
						.on("touchend", function(d) {
							defaultintrobars();
							defaultintrolabels();

							d3.select(this)
							.selectAll("path")
							.classed ("borohighlight", false);
						});
						
					boroughs.append("path")
					   .attr("d", path)
					   .attr("class", "mapborough");

					var labelgroup = boroughs.append("g")
							.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
							.attr("id", function(d){
					   	 		return d.properties.boro_name + "maplabelgroup";
					   });

					if (windowwidth < 500) {
						d3.select("#Manhattanmaplabelgroup")
						.attr("transform", function(d) { 
							var centroid = path.centroid(d),
				            lx = centroid[0],
				            ly = centroid[1];
				        	return "translate(" + lx + "," + ly*1.1 + ")"
						});
					}

					var labeltext = labelgroup.append("text")
						.text(function(d) {
							return d.properties.boro_name;
							})
						.each(function(d) {
							d.textwidth = this.getBBox().width + 30;
							this.remove()
						});

					labelgroup.append("rect")
	      		    	.attr('height', 30)
	      		    	.attr('width', function(d){
	      		    		return d.textwidth;
	      		    		})
	                	.attr('x', function(d){
	      		    		return d.textwidth * -0.5;
	      		    		})
	                	.attr('y', -20)
	                	.attr('rx', 5)
	                	.attr('ry', 5)
	                	.attr("class", function(d){
					   	 return d.properties.boro_name;
					   })


	                labeltext = labelgroup.append("text")
						.attr("class", "borolabel")
							.attr("text-anchor", "middle")
						.text(function(d) {
							return d.properties.boro_name;
							})
						.each(function(d) {
							d.textwidth = this.getBBox().width;
						});


				});// End Geo JSON load
			});// End CSV load
		},// End intromap

		unemployline: function() {
			// set container dimensions
			var $container = $('#unemploychart');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 10, bottom: 20, left: 25 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

			//recessions
			var recessionbegin = dateFormat("12/1/2007");
			var recessionend = dateFormat("6/1/2009");

				// Set number of ticks on x-axis
			if (width <= 500 ) {numticks = 5;}
			else {numticks = 15;}

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickFormat(function(d){
						return d + "%";
						});

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up baseline line generator before transition
			var baselinebefore = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(height);

			//Set up baseline line generator 
			var baseline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(function(d) {
					return heightscale(+d.y);
				});

			//Set up line generator before transition
			var linebefore = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(height);

			//Set up line generator after transition
			var line = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Citywide);
				});

			//Set up Manhattan line generator 
			var manline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Manhattan);
				});

			//Set up Brooklyn line generator 
			var bkline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Brooklyn);
				});

			//Set up Queens line generator 
			var qnline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Queens);
				});

			//Set up Bronx line generator 
			var bxline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Bronx);
				});

			//Set up Staten Island line generator 
			var siline = d3.svg.line()
				.defined(function(d) { return d.Staten; })
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Staten);
				});

			// create svg
			var svg = d3.select("#unemploychart")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/unemploy.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	

				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							rate: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					})
					.slice(6,8);

				//Set scale domains
				heightscale.domain([
					0, 
					d3.max(data,function(d){return +d.TotalMax + 1;})
				]);

				widthscale.domain([
					d3.min(data,function(d){return +d.Date;}), 
					d3.max(data,function(d){return +d.Date;})
				]);

				//add recessions
				svg.append("g")
					.append("rect")
					.attr("x", widthscale(recessionbegin))
					.attr("y", 0)
					.attr("width", widthscale(recessionend) - widthscale(recessionbegin))
					.attr("height", height)
					.attr("class", "recession");
				
				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x-axis axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);
				
				svg.append("rect")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) -55)
					.attr("y", 12)
					.attr("width", 110)
					.attr("height", 20)
					.attr("class", "recessionbox");

				//add recession text
				svg.append("text")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) )
					.attr("y", 26)
					.text("Great Recession")
					.attr("text-anchor", "middle")
					.attr("class", "barlabel recessiontext");

				//create group for baseline paths
				var baselinegroup = svg.append("g")
					.attr("class", "linegroup hidden");

				//add baseline paths
				var baselines = baselinegroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name +"Ln" +" Baseline";
					} )
					.attr("d", function(d) {
		  			return baselinebefore(d.rate);
		  			})
					.attr("fill", "none");

				//create group for lines paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");

				//add line paths
				var beforeline = linegroup.selectAll("path")
					.data([ data ])
					.enter()
					.append("path")
					.attr ("class", "CitywideLn")
					.attr("d", linebefore)
					.attr("fill", "none");
				
				var unemploywaypoint = new Waypoint({
					element: document.getElementById('unemploychart'),
					handler: function() {
					beforeline.transition()
					.duration(timer)
					.attr("d", line);
					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			})
					unemploywaypoint.disable();
					},
					offset: '60%'
				});

				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 30)
	      		    .attr('width', 110)
	                .attr('x', -55)
	                .attr('y', -40)
	                .attr("class", "focustextback");

	  			var focustext = focus.append("text")
	      			.attr("x", 0)
	     			.attr("dy", "-20")
	     			.attr("text-anchor","middle")
	     			.attr("class", "focustext");

	 			var focuscircle = focus.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Citywide calloutcircle");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { focus.style("display", null); })
					.on("touchstart", function() { focus.style("display", null); })
	      			.on("mouseout", function() { focus.style("display", "none"); })
	      			.on("touchend", function() { focus.style("display", "none"); })
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-55) {
			 				focustextback.attr("transform", "translate(-55,0)");
			 				focustext.attr("transform", "translate(-55,0)");
			 			}
				    else if(widthscale(d.Date) < 55) {
			 				focustextback.attr("transform", "translate(55,0)");
			 				focustext.attr("transform", "translate(55,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustext.attr("transform", "translate(0,0)");
			 			}

				    if ($('#cityunemploybutton').hasClass("active")) {
				     	focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Citywide) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Citywide,1) + "%");
	   					}
	   				
	   				if ($('#manunemloybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Manhattan) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Manhattan,1) + "%");
	   					}
	   				
	   				if ($('#bkunemloybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Brooklyn) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Brooklyn,1) + "%");
	   					}
	   				
	   				if ($('#bxunemloybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Bronx) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Bronx,1) + "%");
	   					}
	   				
	   				if ($('#qnunemloybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Queens) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Queens,1) + "%");
	   					}

	   				if ($('#siunemloybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Staten) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": " + d3.round(d.Staten,1) + "%");
	   					}
				  }

				//button actions
				$('#cityunemploybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", line)
					.attr ("class", "CitywideLn");

	      			focuscircle.attr("class","Citywide calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#manunemloybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", manline)
					.attr ("class", "ManhattanLn");

	      			focuscircle.attr("class","Manhattan calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bkunemloybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", bkline)
					.attr ("class", "BrooklynLn");

	      			focuscircle.attr("class","Brooklyn calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bxunemloybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", bxline)
					.attr ("class", "BronxLn");

					focuscircle.attr("class","Bronx calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#qnunemloybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", qnline)
					.attr ("class", "QueensLn");

					focuscircle.attr("class","Queens calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#siunemloybutton').click(function(){

					beforeline.transition()
					.duration(timer)
					.attr("d", siline)
					.attr ("class", "StatenLn");

					focuscircle.attr("class","Staten calloutcircle");

					baselines.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return baseline(d.rate);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				if (width <= 500 ) {
					$("#unemploybaselegend").hide();
						baselinegroup.classed("hidden", true);
					}	
				else {
					$("#unemploybaselegend").show();
					baselinegroup.classed("hidden", false);
				}

			});// End CSV load
		}, // End mediansalesline

		jobsline: function() {
			// set container dimensions
			var $container = $('#jobschart');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 2, right: 15, bottom: 20, left: 23 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");

			//recessions
			var recessionbegin = dateFormat("12/1/2007");
			var recessionend = dateFormat("6/1/2009");

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

				// Set number of ticks on x-axis
			if (width <= 400 ) {numticks = 5;}
			else {numticks = 10;}

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.tickFormat (function(d) {
					return d3.round((+d),0);
				})
				.innerTickSize(-width)
				.outerTickSize(0);

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up area generator after transition
			var linebefore = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(height);

			//Set up area generator after transition
			var line = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(function(d) {
					return heightscale(+d.y);
				});

			// create svg
			var svg = d3.select("#jobschart")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/cpiu.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	
			
				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							cpiu: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});
				//Set scale domains
				heightscale.domain([ 
					d3.min(dataset[0].cpiu,
					function(d){
						return(+d.y)-10;
					}),
					d3.max(dataset[dataset.length -1].cpiu,
					function(d){
						return(+d.y)+15;
					})
				]);

				widthscale.domain([
					d3.min(dataset[dataset.length - 1].cpiu, function(d) {
						return +d.x;
					}),
					d3.max(dataset[dataset.length -1].cpiu, function(d) {
						return +d.x;
					})
				]);

				//add recessions
				svg.append("rect")
					.attr("x", widthscale(recessionbegin))
					.attr("y", 0)
					.attr("width", widthscale(recessionend) - widthscale(recessionbegin))
					.attr("height", height)
					.attr("class", "recession");

				// call Y-axis
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				svg.append("rect")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) -55)
					.attr("y", 12)
					.attr("width", 110)
					.attr("height", 20)
					.attr("class", "recessionbox");

				//add recession text
				svg.append("text")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) )
					.attr("y", 26)
					.text("Great Recession")
					.attr("text-anchor", "middle")
					.attr("class", "barlabel recessiontext");

				//creates group for line paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");

				//add line paths
				var beforeline= linegroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + "Ln";
					})
					.classed("Baseline", function(d) {

						if (d.name == "USCity" ||
							d.name == "Northeast") {
							return true;
						} else {
							return false;
						}
					})
					.attr("d", function(d) {
		  			return linebefore(d.cpiu);
		  			})
		  			.attr("fill", "none");

				var jobswaypoint = new Waypoint({
					element: document.getElementById('jobschart'),
					handler: function() {
					beforeline.transition()
						.duration(timer)
						.attr("d", function(d) {
				  			return line(d.cpiu);
				  			});
					jobswaypoint.disable();
					},
					offset: '60%'
				});

				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 30)
	      		    .attr('width', 120)
	                .attr('x', -60)
	                .attr('y', -40)
	                .attr("class", "focustextback");

	  			var focustext = focus.append("text")
	      			.attr("x", 0)
	     			.attr("dy", "-20")
	     			.attr("text-anchor","middle")
	     			.attr("class", "focustext");

	 			var focuscircle = focus.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "NewYork calloutcircle");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { focus.style("display", null); })
					.on("touchstart", function() { focus.style("display", null); })					
	      			.on("mouseout", function() { focus.style("display", "none"); })
	      			.on("touchend", function() { focus.style("display", "none"); })
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
			 		if(widthscale(d.Date) < 60) {
			 				focustextback.attr("transform", "translate(60,0)");
			 				focustext.attr("transform", "translate(60,0)");
			 			}
			 		else if(widthscale(d.Date) > width-60) {
			 				focustextback.attr("transform", "translate(-60,0)");
			 				focustext.attr("transform", "translate(-60,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustext.attr("transform", "translate(0,0)");
			 			}
					
					focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.NewYork) + ")");
				    focus.select("text")
				    	.text( monthFormat(d.Date) + ": " + d3.round(d.NewYork,1));
				  }

			});
		},// END jobsline

		eduline: function() {
			// set container dimensions
			var $container = $('#gradratechart');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 2, right: 15, bottom: 20, left: 30 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");

			//Set up stack method
			var stack = d3.layout.stack()
						.values(function(d) {
							return d.graduates;
							});

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

				// Set number of ticks on x-axis
			if (width <= 400 ) {numticks = 5;}
			else {numticks = 10;}

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.tickFormat (function(d) {
					return d3.round((+d),0) + "%";
				})
				.innerTickSize(-width)
				.outerTickSize(0);

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up area generator after transition
			var areabefore = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(height)
				.y1(height);

			//Set up area generator after transition
			var area = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(function(d) {
					return heightscale(+d.y0);
				})
				.y1(function(d) {
					return heightscale(+d.y0 + +d.y);
			});


			// create svg
			var svg = d3.select("#gradratechart")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/gradrate.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	
			
				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							graduates: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});
				stack(dataset); //apply stack
				
				//Set scale domains
				heightscale.domain([0, d3.max(dataset[dataset.length -1].graduates,
					function(d){
						return(+d.y0 + +d.y) *1.1;
					})
				]);

				widthscale.domain([
					d3.min(dataset[dataset.length - 1].graduates, function(d) {
						return +d.x;
					}),
					d3.max(dataset[dataset.length -1].graduates, function(d) {
						return +d.x;
					})
				]);

				//creates group for area paths
				var areagroup = svg.append("g")
					.attr("class", "areagroup");

				//add area paths
				var beforearea= areagroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + " area";
					})
					.attr("d", function(d) {
		  			return areabefore(d.graduates);
		  			})
					.attr("stroke", "none");

				var edulinewaypoint = new Waypoint({
					element: document.getElementById('gradratechart'),
					handler: function() {
						beforearea.transition()
						.duration(timer)
						.attr("d", function(d) {
				  			return area(d.graduates);
				  			});
						edulinewaypoint.disable();
					},
					offset: '60%'
				});

				// call Y-axis
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);
				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focusline = focus.append("rect")
	      		    .attr("width", 2)
	      			.attr("height", height);

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 90)
	      		    .attr('width', 175)
	                .attr('x', 10)
	                .attr('y', 130)
	                .attr("class", "focustextback");

	  			var focustextbox = focus.append("text")
	     			.attr("y", 150)
	     			.attr("text-anchor","start")
	     			.attr("class", "focustext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("id", "GradDatetext")
	     			.attr("font-weight", "500");

	       		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Localtext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Regtext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "AdvRegtext");

	 			var  AdvRegfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "AdvReg calloutcircle")
	      			.style("display", "none");

	 			var  Regfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Reg calloutcircle")
	      			.style("display", "none");
	 			
	 			var Localfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Local calloutcircle")
	      			.style("display", "none");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { 
						focus.style("display", null);
						AdvRegfocuscircle.style("display", null);
						Regfocuscircle.style("display", null);
						Localfocuscircle.style("display", null);
						})
					.on("touchstart", function() { 
						focus.style("display", null);
						AdvRegfocuscircle.style("display", null);
						Regfocuscircle.style("display", null);
						Localfocuscircle.style("display", null);
						})
	      			.on("mouseout", function() { 
	      				focus.style("display", "none");
	      				AdvRegfocuscircle.style("display", "none");
	      				Regfocuscircle.style("display", "none");
	      				Localfocuscircle.style("display", "none");
	      				})
	      			.on("touchend", function() { 
	      				focus.style("display", "none");
	      				AdvRegfocuscircle.style("display", "none");
	      				Regfocuscircle.style("display", "none");
	      				Localfocuscircle.style("display", "none");
	      				})
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-175) {
			 				focustextback.attr("transform", "translate(-185,0)");
			 				focustextbox.attr("transform", "translate(-185,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustextbox.attr("transform", "translate(0,0)");
			 			}
					
					focus.attr("transform", "translate(" + widthscale(d.Date) + ",0)");
					AdvRegfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.AdvReg) + ")");
					Regfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Reg + +d.AdvReg) + ")");
					Localfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Local + +d.Reg + +d.AdvReg) + ")");
				    	
				    focus.select("#GradDatetext")
				    	.text( scaleFormat(d.Date)+": " + +d3.round(+d.Local + +d.Reg + +d.AdvReg,1) +"%");

				    focus.select("#Localtext")
				    	.text( "Local: " + d3.round(d.Local,1) +"%");

				    focus.select("#Regtext")
				    	.text( "Regents: " + d3.round(d.Reg,1) +"%");

				    focus.select("#AdvRegtext")
				    	.text( "Advanced Regents: " + d3.round(d.AdvReg,1) +"%");
				  };
			});
		},// END eduline

		eduscatter: function () {
			// set container dimensions
			var $container = $('#eduscatter');
			var containerwidth = $container.width();
			var containerheight = containerwidth;


			//set chart dimensions and margins
			var chartmargins = { top: 30, right: 15, bottom: 25, left: 38 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;



			//create scales
			var widthscale = d3.scale.linear()
								.range([0, width]);

			var heightscale = d3.scale.linear()
								.range([0,height]);
			
			// Set width of cirlces
			var diameter = 0;
			var diameterhl = 6;
				if (width <= 325 ) {diameter = 1.5;}
				else {diameter = 3;}

			// Set number of ticks on x-axis
				if (width <= 325 ) {numticks = 5;}
				else {numticks = 10;}	

			//create axis

			var yAxis = d3.svg.axis()
						.scale(heightscale)
						.orient("left")
						.tickFormat(function(d){
							return d +"%";
							})
						.ticks(numticks)
						.innerTickSize(-width)
		    			.outerTickSize(0)
		    			.tickPadding(10);

			var xAxis = d3.svg.axis()
					.scale(widthscale)
					.orient("bottom")
					.ticks(numticks)
					.tickFormat(function(d){
						return d +"%";
						})
					.innerTickSize(-height)
		    		.outerTickSize(0)
		    		.tickPadding(10);

		    var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.AllGradeELA, 1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.AllGradeMath, 1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.AllGradeMath) < (height/2)) {
			  		if (widthscale(d.AllGradeELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.AllGradeELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip3 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.ThreeELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.ThreeMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.ThreeMath) < (height/2)) {
			  		if (widthscale(d.ThreeELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.ThreeELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip4 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.FourELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.FourMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.FourMath) < (height/2)) {
			  		if (widthscale(d.FourELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.FourELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip5 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.FiveELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.FiveMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.FiveMath) < (height/2)) {
			  		if (widthscale(d.FiveELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.FiveELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip6 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.SixELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.SixMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.SixMath) < (height/2)) {
			  		if (widthscale(d.SixELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.SixELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip7 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.SevenELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.SevenMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.SevenMath) < (height/2)) {
			  		if (widthscale(d.SevenELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.SevenELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			var tip8 = d3.tip()
			  .attr('class', 'd3-tip')
			  .html(function(d) { return "<ul><li><h5>" + d.School + "</h5></li><li><span><b>ELA: </b><span>" + d3.round(d.EightELA,1) + "%</li><li><span><b>Math: </b><span>" + d3.round(d.EightMath,1) + "%</li></ul>";})
			  .direction( function (d) {
			  	if (heightscale(d.EightMath) < (height/2)) {
			  		if (widthscale(d.EightELA) < (width/2)) {return "se";}
			  		else {return "sw";}
			  	}
			  	else {
			  		if (widthscale(d.EightELA) < (width/2)) {return "ne";}
			  		else {return "nw";}
			  	}});

			// create svg
			var svg = d3.select("#eduscatter")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//Brings in scatterplot data
			d3.csv("data/schoolsdata.csv", function(data) {

				widthscale.domain([0, 100]);
				heightscale.domain([100, 0]);
				
				//Call Axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				//Call d3tip
				svg.call(tip)
					.call(tip3)
					.call(tip4)
					.call(tip5)
					.call(tip6)
					.call(tip7)
					.call(tip8);

				//Create axis labels
				svg.append("text")
					.attr("class", "axislabel")
					.attr("x",-38)
					.attr("y",-15)
					.text ("MATH")
					.attr("text-anchor", "start");

				svg.append("text")
					.attr("class", "axislabel")
					.attr("x",width + 15)
					.attr("y",height -10)
					.text ("ENGLISH LANGUAGE ARTS")
					.attr("text-anchor", "end");
				
				//Creates circles, binds data and adds identifying classes
				function createcircles() {
					svg.selectAll("circle")
					.data(data)
					.enter()
					.append("circle")
					.attr("r", +diameter)
					.attr("fill-opacity", 0.9)
	      			.attr("class", function(d){
								return d.Borough;});
					}
				
				//Returns circles to 0,0
				function backtozero() {
					svg.selectAll("circle")
					.transition()
					.duration(timer)
					.attr("cx",0)
					.attr("cy", height)
					.remove();
				}
				
				//Creates default circles
				function allgradecircles() {
					var newcircle = svg.selectAll("circle")
						.sort(function(a, b) {
							return d3.descending(+a.AllGradeELA, +b.AllGradeELA);
							})
						.attr("cx",0)
						.attr("cy",height)
						.on('mouseover', function(d){
							tip.show(d);
							d3.select(this)
							.transition()
							.duration(0)
							.attr("r", +diameterhl);
							d3.select(this)
							.classed("calloutcircle", true);

						})
	      				.on('mouseout', function(d){
							tip.hide(d);
							d3.select(this)
							.transition()
							.duration(0)
							.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});

					//Remove incomplete data
					svg.selectAll("circle")
						.filter(function(d) {
							return +d.AllGradeELA == 0 || +d.AllGradeMath == 0
						})
						.remove();

					var eduscatterwaypoint = new Waypoint({
						element: document.getElementById('eduscatter'),
						handler: function() {
						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.AllGradeELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.AllGradeMath);
								});
							eduscatterwaypoint.disable();
						},
						offset: '60%'
					});

				}

				// Grade Buttons: START
				$('#allscatterbutton').click(function(){
					backtozero();
					setTimeout(function(){
						createcircles();
						allgradecircles();
					}, timer * 1.1);	
				});

				$('#threescatterbutton').click(function(){
					backtozero();
					setTimeout(function(){
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.ThreeELA, b.ThreeELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip3.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
						})
	      					.on('mouseout', function(d){
								tip3.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});

						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.ThreeELA == 0 || +d.ThreeMath == 0
							})
							.remove();

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.ThreeELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.ThreeMath);
								});
					}, timer * 1.1);	
				});

				$('#fourscatterbutton').click(function(){
					backtozero();
					setTimeout(function(){
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.FourELA, b.FourELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip4.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
						})
	      					.on('mouseout', function(d){
								tip4.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});
						
						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.FourELA == 0 || +d.FourMath == 0
							})
							.remove();

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.FourELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.FourMath);
								});
						}, timer * 1.1);
				});

				$('#fivescatterbutton').click(function(){
					backtozero();
					setTimeout(function(){
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.FiveELA, b.FiveELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip5.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
						})
	      					.on('mouseout', function(d){
								tip5.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});
						
						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.FiveELA == 0 || +d.FiveMath == 0
							})
							.remove();

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.FiveELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.FiveMath);
								});
						}, timer * 1.1);
				});

				$('#sixscatterbutton').click(function(){
					backtozero();
					setTimeout(function(){
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.SixELA, b.SixELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip6.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
						})
	      					.on('mouseout', function(d){
								tip6.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});
						
						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.SixELA == 0 || +d.SixMath == 0
							})
							.remove();

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.SixELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.SixMath);
								});
					}, timer * 1.1);
				});

				$('#sevenscatterbutton').click(function(){
					backtozero();
					setTimeout(function() {
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.SevenELA, b.SevenELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip7.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
						})
	      					.on('mouseout', function(d){
								tip7.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
						});
						
						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.SevenELA == 0 || +d.SevenMath == 0
							})
							.remove();						

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.SevenELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.SevenMath);
								});
					}, timer * 1.1);
				});

				$('#eightscatterbutton').click(function(){
					backtozero();
					setTimeout(function() {
						createcircles();
						var newcircle = svg.selectAll("circle")
							.sort(function(a, b) {
								return d3.descending(a.EightELA, b.EightELA);
								})
							.attr("cx",0)
							.attr("cy", height)
							.on('mouseover', function(d){
								tip8.show(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameterhl);
								d3.select(this)
							.classed("calloutcircle", true);
							})
	      					.on('mouseout', function(d){
								tip8.hide(d);
								d3.select(this)
								.transition()
								.duration(0)
								.attr("r", +diameter);
							d3.select(this)
							.classed("calloutcircle", false);
							});
						
						//Remove incomplete data
						svg.selectAll("circle")
							.filter(function(d) {
								return +d.EightELA == 0 || +d.EightMath == 0
							})
							.remove();

						newcircle.transition()
							.duration(timer)
							.attr("cx", function(d) {
								return widthscale(d.EightELA);
								})
							.attr("cy", function(d) {
								return heightscale(d.EightMath);
								});
					}, timer * 1.1);
				});
				//Grade buttons: END
				//Call default state functions
				createcircles();
				allgradecircles();
				}); //END CSV Load
		},// END scatter

		edubars: function() {
			// set container dimensions
			var $container = $('#educitywidebar');
			var containerwidth = $container.width();
			var containerheight = 200;

			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 2, bottom: 15, left: 2 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//set up date formatter for scale
			var dateformat = d3.time.format("%x");
			var scaleformat = d3.time.format("%Y");

			//set up scales
			var heightscale = d3.scale.linear ()
						.range ([height, 0]);

			var widthscale = d3.scale.ordinal ()
						.rangeBands ([0, width], 0.2);

			//create x axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.outerTickSize(0)
				.innerTickSize(0)
				.tickFormat(function(d){
						return scaleformat(dateformat.parse(d));
						})
				.ticks(3)
				.tickPadding(5);

					
			//y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.tickFormat(function(d){
						return d +"%";
						})
				.outerTickSize(0)
				.ticks(5);

			//create svgs
			var Citybarsvg = d3.select("#educitywidebar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			var Manbarsvg = d3.select("#edumanhattanbar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			var Bkbarsvg = d3.select("#edubrooklynbar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			var Bxbarsvg = d3.select("#edubronxbar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");
			
			var Qnbarsvg = d3.select("#eduqueensbar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			var Sibarsvg = d3.select("#edustatensbar")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//Load in contents of CSV file
			d3.csv("data/boroughedu.csv", function(data) {

				//set scale domains
				heightscale.domain ([0, d3.max(data, function(d){
							return +d.Max + 5;}) 
							]);		
				widthscale.domain(data.map(function(d) { return d.Date; } ));

				//Start Citywide bar chart
				//Create groups
				var Citybargroups = Citybarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//Create bars
				var Cityrects = Citybargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.CityElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.CityElaLv34);
					})
					.attr("class", "Citywide");
				
				//Create labels
				var Cityrectslabels = Citybargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.CityElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.CityElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel ");

				//Call Axis
				Citybarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Citywide bar chart
				
				//Start Manhattan bar chart
				//Create groups
				var Manbargroups = Manbarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//Create bars
				var Manrects = Manbargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.MANElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.MANElaLv34);
					})
					.attr("class", "Manhattan");

				//Create labels
				var Manrectslabels = Manbargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.MANElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.MANElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel");

				//Call Axis
				Manbarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Manhattan bar chart

				//Start Brooklyn bar chart
				//Create groups
				var Bkbargroups = Bkbarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//create bars
				var Bkrects = Bkbargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.BKElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.BKElaLv34);
					})
					.attr("class", "Brooklyn");

				//Create labels
				var Bkrectslabels = Bkbargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.BKElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.BKElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel");

				//Call Axis
				Bkbarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Brooklyn bar chart

				//Start Bronx bar chart
				//Create groups
				var Bxbargroups = Bxbarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//create bars
				var Bxrects = Bxbargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.BXElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.BXElaLv34);
					})
					.attr("class", "Bronx");

				//Create labels
				var Bxrectslabels = Bxbargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.BXElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.BXElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel");

				//Call Axis
				Bxbarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Bronx bar chart

				//Start Queens bar chart
				//Create groups
				var Qnbargroups = Qnbarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//create bars
				var Qnrects = Qnbargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.QNElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.QNElaLv34);
					})
					.attr("class", "Queens");

				//Create labels
				var Qnrectslabels = Qnbargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.QNElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.QNElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel");

				//Call Axis
				Qnbarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Queens bar chart	

				//Start Staten Island bar chart
				//Create groups
				var Sibargroups = Sibarsvg.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "bar");

				//create bars
				var Sirects = Sibargroups.append("rect")
					.attr("x", function(d, i) {
									return widthscale(d.Date);
								})
					.attr("y", function(d) {
						return heightscale(d.SIElaLv34);
					})
					.attr("width", widthscale.rangeBand())
					.attr("height", function(d) {
						return height - heightscale(d.SIElaLv34);
					})
					.attr("class", "Staten");

				//Create labels
				var Sirectslabels = Sibargroups.append("text")
					.attr("x", function(d) {
									return widthscale(d.Date) + (widthscale.rangeBand()/2);
								})
					.attr("y", function(d) {
						return heightscale(d.SIElaLv34) - 5;
					})
					.text(function(d) {
						return (d3.round(d.SIElaLv34, 0) + "%");
					})
					.attr("text-anchor", "middle")
					.attr("class", "barlabel");

				//Call Axis
				Sibarsvg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//End Staten Island bar chart	


			//Button actions
			$('#Mathbarbutton').click(function(){
				Cityrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.CityMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.CityMathLv34);
					});
					
				Cityrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.CityMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.CityMathLv34, 0) + "%");
					});

				Manrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.MANMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.MANMathLv34);
					});
					
				Manrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.MANMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.MANMathLv34, 0) + "%");
					});

				Bkrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BKMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.BKMathLv34);
					});
				
				Bkrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BKMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.BKMathLv34, 0) + "%");
					});

				Bxrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BXMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.BXMathLv34);
					});
				
				Bxrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BXMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.BXMathLv34, 0) + "%");
					});

				Qnrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.QNMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.QNMathLv34);
					});
				
				Qnrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.QNMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.QNMathLv34, 0) + "%");
					});

				Sirects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.SIMathLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.SIMathLv34);
					});
				
				Sirectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.SIMathLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.SIMathLv34, 0) + "%");
					});
			});

			$('#ELAbarbutton').click(function(){
				Cityrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.CityElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.CityElaLv34);
					});
				
				Cityrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.CityElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.CityElaLv34, 0) + "%");
					});

				Manrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.MANElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.MANElaLv34);
					});
					
				Manrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.MANElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.MANElaLv34, 0) + "%");
					});

				Bkrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BKElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.BKElaLv34);
					});
					
				Bkrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BKElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.BKElaLv34, 0) + "%");
					});

				Bxrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BXElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.BXElaLv34);
					});
					
				Bxrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.BXElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.BXElaLv34, 0) + "%");
					});

				Qnrects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.QNElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.QNElaLv34);
					});
					
				Qnrectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.QNElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.QNElaLv34, 0) + "%");
					});

				Sirects.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.SIElaLv34);
						})
					.attr("height", function(d) {
						return height - heightscale(d.SIElaLv34);
					});
					
				Sirectslabels.transition()
					.duration(timer)
					.attr("y", function(d) {
							return heightscale(d.SIElaLv34) - 5;
						})
					.text(function(d) {
						return (d3.round(d.SIElaLv34, 0) + "%");
					});
			});

			}); // End CSV load
		}, // End edubars;

		homelessline: function() {
			// set container dimensions
			var $container = $('#homelesschart');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 2, right: 12, bottom: 20, left: 40 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");



			//Set up stack method
			var stack = d3.layout.stack()
						.values(function(d) {
							return d.population;
							});

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

				// Set number of ticks on x-axis
			if (width <= 500 ) {numticks = 5;}
			else {numticks = 15;}	

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0);


			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up area generator before transition
			var areabefore = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(height)

				.y1(height);

			//Set up area generator after transition
			var area = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(function(d) {
					return heightscale(+d.y0);
				})
				.y1(function(d) {
					return heightscale(+d.y0 + +d.y);
			});

			// create svg
			var svg = d3.select("#homelesschart")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/homelesspop.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	
			
				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							population: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});

				stack(dataset); //apply stack

				//Set scale domains
				heightscale.domain([0, d3.max(dataset[dataset.length -1].population,
					function(d){
						return(+d.y0 + +d.y) *1.02;
					})
				]);

				widthscale.domain([
					d3.min(dataset[dataset.length - 1].population, function(d) {
						return +d.x;
					}),
					d3.max(dataset[dataset.length -1].population, function(d) {
						return +d.x;
					})
				]);

				//creates group for area paths
				var areagroup = svg.append("g")
					.attr("class", "areagroup");

				//add area paths
				var beforearea = areagroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + " area";
					})
					.attr("d", function(d) {
		  			return areabefore(d.population);
		  			})
					.attr("stroke", "none");

				var homelesswaypoint = new Waypoint({
					element: document.getElementById('homelesschart'),
					handler: function() {
					beforearea.transition()
						.duration(timer)
						.attr("d", function(d) {
				  			return area(d.population);
			  			});	
					homelesswaypoint.disable();
					},
					offset: '60%'
				});
				
				// call Y-axis
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focusline = focus.append("rect")
	      		    .attr("width", 2)
	      			.attr("height", height);

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 105)
	      		    .attr('width', 165)
	                .attr('x', 10)
	                .attr('y', 120)
	                .attr("class", "focustextback");

	  			var focustextbox = focus.append("text")
	     			.attr("y", 140)
	     			.attr("text-anchor","start")
	     			.attr("class", "focustext");
	     		
	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("id", "HomelessDatetext")
	     			.attr("font-weight", "500");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "singlewomentext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "singlementext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "adultsinfamiliestext");

	     		focustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "childrentext");

	 			var childrenfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "children calloutcircle")
	      			.style("display", "none");

	 			var adultsInfamiliesfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "adultsInfamilies calloutcircle")
	      			.style("display", "none");
	 			
	 			var singleMenfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "singleMen calloutcircle")
	      			.style("display", "none");
	 			
	 			var singleWomenfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "singleWomen calloutcircle")
	      			.style("display", "none");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { 
						focus.style("display", null);
						childrenfocuscircle.style("display", null);
						adultsInfamiliesfocuscircle.style("display", null);
						singleMenfocuscircle.style("display", null);
						singleWomenfocuscircle.style("display", null);
						})
					.on("touchstart", function() { 
						focus.style("display", null);
						childrenfocuscircle.style("display", null);
						adultsInfamiliesfocuscircle.style("display", null);
						singleMenfocuscircle.style("display", null);
						singleWomenfocuscircle.style("display", null);
						})
	      			.on("mouseout", function() { 
	      				focus.style("display", "none");
	      				childrenfocuscircle.style("display", "none");
	      				adultsInfamiliesfocuscircle.style("display", "none");
	      				singleMenfocuscircle.style("display", "none");
	      				singleWomenfocuscircle.style("display", "none");
	      				})
	      			.on("touchend", function() { 
	      				focus.style("display", "none");
	      				childrenfocuscircle.style("display", "none");
	      				adultsInfamiliesfocuscircle.style("display", "none");
	      				singleMenfocuscircle.style("display", "none");
	      				singleWomenfocuscircle.style("display", "none");
	      				})
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);


				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-175) {
			 				focustextback.attr("transform", "translate(-185,0)");
			 				focustextbox.attr("transform", "translate(-185,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustextbox.attr("transform", "translate(0,0)");
			 			}
					
					focus.attr("transform", "translate(" + widthscale(d.Date) + ",0)");
					childrenfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.children) + ")");
					adultsInfamiliesfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.adultsInfamilies + +d.children) + ")");
					singleMenfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.singleMen + +d.adultsInfamilies + +d.children) + ")");
					singleWomenfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.singleWomen + +d.singleMen + +d.adultsInfamilies + +d.children) + ")");
				    	
				    focus.select("#HomelessDatetext")
				    	.text( monthFormat(d.Date)+": " +commaformat(+d.singleWomen + +d.singleMen + +d.adultsInfamilies + +d.children));

				    focus.select("#singlewomentext")
				    	.text( "Single women: " + commaformat(d.singleWomen));

				    focus.select("#singlementext")
				    	.text( "Single men: " + commaformat(d.singleMen));

				    focus.select("#adultsinfamiliestext")
				    	.text( "Adults in families: " + commaformat(d.adultsInfamilies));

				    focus.select("#childrentext")
				    	.text( "Children: " + commaformat(d.children));
				  }

			}); // End CSV load
		},  // End homeless line

		mediansaleslinecontext: function() {
			// set container dimensions
			var $container = $('#mediansalescontext');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 10, bottom: 20, left: 37 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");


			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

			//recessions
			var recessionbegin = dateFormat("12/1/2007");
			var recessionend = dateFormat("6/1/2009");

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickFormat(function(d){
						return "$" + commaformat(d);
						});

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(3)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up line generator after transition
			var linebefore = d3.svg.line()
				.defined(function(d) { return d.y !== 0; })
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(height);

			//Set up line generator after transition
			var line = d3.svg.line()
				.defined(function(d) { return d.y !== 0; })
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(function(d) {
					return heightscale(+d.y);
				});


			// create svg
			var svg = d3.select("#mediansalescontext")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/mediansalepsf.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	

				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							price: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});

				//Set scale domains
				heightscale.domain([ 
					d3.min(dataset[3].price,
					function(d){
						return(+d.y)-50;
					}),
					d3.max(dataset[2].price,
					function(d){
						return(+d.y)+50;
					})
				]);

				widthscale.domain([
					d3.min(dataset[2].price, function(d) {
						return +d.x;
					}),
					d3.max(dataset[2].price, function(d) {
						return +d.x;
					})
				]);

				//add recessions
				svg.append("rect")
					.attr("x", widthscale(recessionbegin))
					.attr("y", 0)
					.attr("width", widthscale(recessionend) - widthscale(recessionbegin))
					.attr("height", height)
					.attr("class", "recession");

				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x-axis axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);
				
				//create group for lines paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");

				//add line paths
				var beforeline = linegroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + "Ln" + " contextline";
					})
					.attr ("id", function(d) {
						return d.name + "CxtLn";
					})
					.attr("d", function(d) {
		  			return linebefore(d.price);
		  			})
					.attr("fill", "none");

				var mediansalescontextwaypoint = new Waypoint({
					element: document.getElementById('mediansalescontext'),
					handler: function() {
						beforeline.transition()
							.duration(timer)
							.attr("d", function(d) {
		  						return line(d.price);
		  					});
						d3.select("#CitywideCxtLn").classed("contextlinehighlight", true);
						mediansalescontextwaypoint.disable();
					},
					offset: '60%'
				});

				//button actions
				
				$('#citysalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#CitywideCxtLn").classed("contextlinehighlight", true);
				});

				$('#mansalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#ManhattanCxtLn").classed("contextlinehighlight", true);
				});

				$('#bksalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#BrooklynCxtLn").classed("contextlinehighlight", true);
				});

				$('#bxsalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#BronxCxtLn").classed("contextlinehighlight", true);					 
				});

				$('#qnsalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#QueensCxtLn").classed("contextlinehighlight", true);
				});

				$('#sisalesbutton').click(function(){
					linegroup.selectAll("path")
					.classed("contextlinehighlight", false);
					d3.select("#StatenCxtLn").classed("contextlinehighlight", true);
				});
			});// End CSV load
		}, // End drawmediansaleslinecontext

		mediansalesline: function() {
			// set container dimensions
			var $container = $('#mediansales');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 10, bottom: 20, left: 37 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");


			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

			//recessions
			var recessionbegin = dateFormat("12/1/2007");
			var recessionend = dateFormat("6/1/2009");

				// Set number of ticks on x-axis
			if (width <= 500 ) {numticks = 5;}
			else {numticks = 15;}

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickFormat(function(d){
						return "$" + commaformat(d);
						});

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up line generator before transition
			var linebefore = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(height);

			//Set up line generator after transition
			var line = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Citywide);
				});

			//Set up Manhattan line generator 
			var manline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Manhattan);
				});

			//Set up Brooklyn line generator 
			var bkline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Brooklyn);
				});

			//Set up Queens line generator 
			var qnline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Queens);
				});

			//Set up Bronx line generator 
			var bxline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Bronx);
				});

			//Set up Staten Island line generator 
			var siline = d3.svg.line()
				.defined(function(d) { return d.Staten; })
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Staten);
				});



			// create svg
			var svg = d3.select("#mediansales")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/mediansalepsf.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	

				//Set scale domains
				heightscale.domain([
					d3.min(data,function(d){return +d.Citywide - 75;}), 
					d3.max(data,function(d){return +d.Citywide + 75;})
				]);

				widthscale.domain([
					d3.min(data,function(d){return +d.Date;}), 
					d3.max(data,function(d){return +d.Date;})
				]);

				//add recessions
				svg.append("rect")
					.attr("x", widthscale(recessionbegin))
					.attr("y", 0)
					.attr("width", widthscale(recessionend) - widthscale(recessionbegin))
					.attr("height", height)
					.attr("class", "recession");

				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x-axis axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				svg.append("rect")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) -55)
					.attr("y", 12)
					.attr("width", 110)
					.attr("height", 20)
					.attr("class", "recessionbox");

				//add recession text
				svg.append("text")
					.attr("x", widthscale(recessionbegin) + ((widthscale(recessionend) - widthscale(recessionbegin))/2) )
					.attr("y", 26)
					.text("Great Recession")
					.attr("text-anchor", "middle")
					.attr("class", "barlabel recessiontext");
				
				//create group for lines paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");


				//add line paths
				var beforeline = linegroup.selectAll("path")
					.data([ data ])
					.enter()
					.append("path")
					.attr ("class", "CitywideLn")
					.attr("d", linebefore)
					.attr("fill", "none");

				var mediansaleswaypoint = new Waypoint({
					element: document.getElementById('mediansales'),
					handler: function() {
						beforeline.transition()
							.duration(timer)
							.attr("d", line);
						mediansaleswaypoint.disable();
					},
					offset: '60%'
				});
				
				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 30)
	      		    .attr('width', 120)
	                .attr('x', -60)
	                .attr('y', -40)
	                .attr("class", "focustextback");

	  			var focustext = focus.append("text")
	      			.attr("x", 0)
	     			.attr("dy", "-20")
	     			.attr("text-anchor","middle")
	     			.attr("class", "focustext");

	 			var focuscircle = focus.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Citywide calloutcircle");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { focus.style("display", null); })
					.on("touchstart", function() { focus.style("display", null); })
	      			.on("mouseout", function() { focus.style("display", "none"); })
	      			.on("touchend", function() { focus.style("display", "none"); })
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-60) {
			 				focustextback.attr("transform", "translate(-60,0)");
			 				focustext.attr("transform", "translate(-60,0)");
			 			}
				    else if(widthscale(d.Date) < 60) {
			 				focustextback.attr("transform", "translate(60,0)");
			 				focustext.attr("transform", "translate(60,0)");
			 			}

			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustext.attr("transform", "translate(0,0)");
			 			}

				    if ($('#citysalesbutton').hasClass("active")) {
				     	focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Citywide) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Citywide));
	   					}
	   				
	   				if ($('#mansalesbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Manhattan) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Manhattan));
	   					}
	   				
	   				if ($('#bksalesbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Brooklyn) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Brooklyn));
	   					}
	   				
	   				if ($('#bxsalesbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Bronx) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Bronx));
	   					}
	   				
	   				if ($('#qnsalesbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Queens) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Queens));
	   					}

	   				if ($('#sisalesbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Staten) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date)+ ": $" + commaformat(d.Staten));
	   					}
				  }

				//button actions
				
				$('#citysalesbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Citywide - 75;}), 
						d3.max(data,function(d){return +d.Citywide + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", line)
					.attr ("class", "CitywideLn");

					focuscircle.attr("class","Citywide calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#mansalesbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Manhattan - 75;}), 
						d3.max(data,function(d){return +d.Manhattan + 100;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", manline)
					.attr ("class", "ManhattanLn");

					focuscircle.attr("class","Manhattan calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bksalesbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Brooklyn - 75;}), 
						d3.max(data,function(d){return +d.Brooklyn + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", bkline)
					.attr ("class", "BrooklynLn");

					focuscircle.attr("class","Brooklyn calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bxsalesbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Bronx - 40;}), 
						d3.max(data,function(d){return +d.Bronx + 40;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", bxline)
					.attr ("class", "BronxLn");

					focuscircle.attr("class","Bronx calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#qnsalesbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Queens - 75;}), 
						d3.max(data,function(d){return +d.Queens + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", qnline)
					.attr ("class", "QueensLn");

					focuscircle.attr("class","Queens calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#sisalesbutton').click(function(){
					heightscale.domain([
						d3.min(data.filter(function(d) { return d.Staten; }),function(d){return +d.Staten - 40;}),
						d3.max(data,function(d){return +d.Staten + 40;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", siline)
					.attr ("class", "StatenLn");

					focuscircle.attr("class","Staten calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});
			});// End CSV load
		}, // End drawmediansalesline

		medianrentlinecontext: function() {
			// set container dimensions
			var $container = $('#medianrentcontext');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 8, bottom: 20, left: 40 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");

			//Set up line generator after transition
			var linebefore = d3.svg.line()
				.defined(function(d) { return d.y !== 0; })
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(height);

			//Set up line generator after transition
			var line = d3.svg.line()
				.defined(function(d) { return d.y !== 0; })
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y(function(d) {
					return heightscale(+d.y);
				});

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickFormat(function(d){
						return "$" + commaformat(d); 
						});

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(3)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			// create svg
			var svg = d3.select("#medianrentcontext")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/rent.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	

				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							price: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});

				//Set scale domains
				heightscale.domain([ 
					d3.min(dataset[3].price,
					function(d){
						return(+d.y)-50;
					}),
					d3.max(dataset[2].price,
					function(d){
						return(+d.y)+50;
					})
				]);

				widthscale.domain([
					d3.min(dataset[2].price, function(d) {
						return +d.x;
					}),
					d3.max(dataset[2].price, function(d) {
						return +d.x;
					})
				]);
				
				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x-axis axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//create group for lines paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");

				//add line paths
				var beforeline = linegroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + "Ln" + " contextline";
					})
					.attr ("id", function(d) {
						return d.name + "CxtLn2";
					})
					.attr("d", function(d) {
		  			return linebefore(d.price);
		  			})
					.attr("fill", "none");
				
				var medianrentcontextwaypoint = new Waypoint({
					element: document.getElementById('medianrent'),
					handler: function() {
						beforeline.transition()
							.duration(timer)
							.attr("d", function(d) {
		  						return line(d.price);
		  					});
						d3.select("#CitywideCxtLn2").classed("contextlinehighlight", true);
						medianrentcontextwaypoint.disable();
					},
					offset: '60%'
				});					

				//button actions
				
				$('#cityrentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#CitywideCxtLn2").classed("contextlinehighlight", true);
				});

				$('#manrentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#ManhattanCxtLn2").classed("contextlinehighlight", true);
				});

				$('#bkrentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#BrooklynCxtLn2").classed("contextlinehighlight", true);
				});

				$('#bxrentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#BronxCxtLn2").classed("contextlinehighlight", true);
				});

				$('#qnrentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#QueensCxtLn2").classed("contextlinehighlight", true);
				});

				$('#sirentbutton').click(function(){
					linegroup.selectAll("path")
						.classed("contextlinehighlight", false);
					d3.select("#StatenCxtLn2").classed("contextlinehighlight", true);
				});
			});// End CSV load
		}, // End drawmedianrentline

		medianrentline: function() {
			// set container dimensions
			var $container = $('#medianrent');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 0, right: 8, bottom: 20, left: 40 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");


			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

				// Set number of ticks on x-axis
			if (width <= 500 ) {numticks = 5;}
			else {numticks = 5;}	

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickFormat(function(d){
						return "$" + commaformat(d); 
						});

			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up line generator before transition
			var linebefore = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(height);

			//Set up line generator after transition
			var line = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Citywide);
				});

			//Set up Manhattan line generator 
			var manline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Manhattan);
				});

			//Set up Brooklyn line generator 
			var bkline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Brooklyn);
				});

			//Set up Queens line generator 
			var qnline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Queens);
				});

			//Set up Bronx line generator 
			var bxline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Bronx);
				});

			//Set up Staten Island line generator 
			var siline = d3.svg.line()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y(function(d) {
					return heightscale(+d.Staten);
				});


			// create svg
			var svg = d3.select("#medianrent")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/rent.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	

				//Set scale domains
				heightscale.domain([
					d3.min(data,function(d){return +d.Citywide - 75;}), 
					d3.max(data,function(d){return +d.Citywide + 75;})
				]);

				widthscale.domain([
					d3.min(data,function(d){return +d.Date;}), 
					d3.max(data,function(d){return +d.Date;})
				]);
				
				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x-axis axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//create group for lines paths
				var linegroup = svg.append("g")
					.attr("class", "linegroup");

				//add line paths
				var beforeline = linegroup.selectAll("path")
					.data([ data ])
					.enter()
					.append("path")
					.attr ("class", "CitywideLn")
					.attr("d", linebefore)
					.attr("fill", "none");
				
				var medianrentwaypoint = new Waypoint({
					element: document.getElementById('medianrent'),
					handler: function() {
						beforeline.transition()
							.duration(timer)
							.attr("d", line);
						medianrentwaypoint.disable();
					},
					offset: '60%'
				});					

				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 30)
	      		    .attr('width', 120)
	                .attr('x', -60)
	                .attr('y', -40)
	                .attr("class", "focustextback");

	  			var focustext = focus.append("text")
	      			.attr("x", 0)
	     			.attr("dy", "-20")
	     			.attr("text-anchor","middle")
	     			.attr("class", "focustext");

	 			var focuscircle = focus.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Citywide calloutcircle");

	     		svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height)
					.on("mouseover", function() { focus.style("display", null); })
					.on("touchstart", function() { focus.style("display", null); })
	      			.on("mouseout", function() { focus.style("display", "none"); })
	      			.on("touchend", function() { focus.style("display", "none"); })
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove);

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-60) {
			 				focustextback.attr("transform", "translate(-60,0)");
			 				focustext.attr("transform", "translate(-60,0)");
			 			}
				    else if(widthscale(d.Date) < 60) {
			 				focustextback.attr("transform", "translate(60,0)");
			 				focustext.attr("transform", "translate(60,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustext.attr("transform", "translate(0,0)");
			 			}

				    if ($('#cityrentbutton').hasClass("active")) {
				     	focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Citywide) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Citywide));
	   					}
	   				
	   				if ($('#manrentbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Manhattan) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Manhattan));
	   					}
	   				
	   				if ($('#bkrentbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Brooklyn) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Brooklyn));
	   					}
	   				
	   				if ($('#bxrentbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Bronx) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Bronx));
	   					}
	   				
	   				if ($('#qnrentbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Queens) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Queens));
	   					}

	   				if ($('#sirentbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Staten) + ")");
				    	focus.select("text")
				    	.text(monthFormat(d.Date) + ": $" + commaformat(d.Staten));
	   					}
				  }

				//button actions
				
				$('#cityrentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Citywide - 75;}), 
						d3.max(data,function(d){return +d.Citywide + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", line)
					.attr ("class", "CitywideLn");

					focuscircle.attr("class","Citywide calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#manrentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Manhattan - 150;}), 
						d3.max(data,function(d){return +d.Manhattan + 200;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", manline)
					.attr ("class", "ManhattanLn");

					focuscircle.attr("class","Manhattan calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bkrentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Brooklyn - 75;}), 
						d3.max(data,function(d){return +d.Brooklyn + 100;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", bkline)
					.attr ("class", "BrooklynLn");

					focuscircle.attr("class","Brooklyn calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#bxrentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Bronx - 75;}), 
						d3.max(data,function(d){return +d.Bronx + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", bxline)
					.attr ("class", "BronxLn");

					focuscircle.attr("class","Bronx calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#qnrentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Queens - 75;}), 
						d3.max(data,function(d){return +d.Queens + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", qnline)
					.attr ("class", "QueensLn");

					focuscircle.attr("class","Queens calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});

				$('#sirentbutton').click(function(){
					heightscale.domain([
						d3.min(data,function(d){return +d.Staten - 75;}), 
						d3.max(data,function(d){return +d.Staten + 75;})
					]);

					beforeline.transition()
					.duration(timer)
					.attr("d", siline)
					.attr ("class", "StatenLn");

					focuscircle.attr("class","Staten calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
				});
			});// End CSV load
		}, // End drawmedianrentlinecontext

		crimeline: function() {
			// set container dimensions
			var $container = $('#crimechart');
			var containerwidth = $container.width();
			var containerheight = 400;


			//set chart dimensions and margins
			var chartmargins = { top: 2, right: 12, bottom: 20, left: 45 };
			var width = containerwidth - chartmargins.left - chartmargins.right;
			var height = containerheight - chartmargins.top - chartmargins.bottom;

			//create date formater
			var dateFormat = d3.time.format("%x").parse;
			var scaleFormat = d3.time.format("%Y");



			//Set up stack method
			var stack = d3.layout.stack()
						.values(function(d) {
							return d.amount;
							});

			//create scales
			var widthscale = d3.time.scale()
				.range([0, width]);

			var heightscale = d3.scale.linear()
				.range([height,0]);

				// Set number of ticks on x-axis
			if (width <= 500 ) {numticks = 5;}
			else {numticks = 15;}

			//create y-axis
			var yAxis = d3.svg.axis()
				.scale(heightscale)
				.orient("left")
				.ticks(10)
				.innerTickSize(-width)
				.outerTickSize(0);


			//create x-axis
			var xAxis = d3.svg.axis()
				.scale(widthscale)
				.orient("bottom")
				.ticks(numticks)
				.outerTickSize(0)
				.tickFormat(function(d) {
					return scaleFormat(d);
				});

			//Set up area generator before transition
			var areabefore = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(height)

				.y1(height);

			//Set up area generator after transition
			var area = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.x);
				})
				.y0(function(d) {
					return heightscale(+d.y0);
				})
				.y1(function(d) {
					return heightscale(+d.y0 + +d.y);
			});

			
			//Set up beforearea2 area generator 
			var beforearea2 = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(height);

			//Set up Grand Larceny area generator 
			var GrandLarcenyArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.GrandLarceny);
				});

			//Set up Felony Assault area generator 
			var FelonyAssaultArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.FelonyAssault);
				});

			//Set up Robbery area generator 
			var RobberyArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.Robbery);
				});

			//Set up Burglary area generator 
			var BurglaryArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.Burglary);
				});

			//Set up GrandLarcenyAuto area generator 
			var GrandLarcenyAutoArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.GrandLarcenyAuto);
				});

			//Set up Rape area generator 
			var RapeArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.Rape);
				});

			//Set up Murder area generator 
			var MurderArea = d3.svg.area()
				.x(function(d) {
					return widthscale(+d.Date);
				})
				.y0(height)
				.y1(function(d) {
					return heightscale(+d.Murder);
				});

			// create svg
			var svg = d3.select("#crimechart")
				.append("svg")
				.attr("width", width + chartmargins.left + chartmargins.right)
				.attr("height", height + chartmargins.top + chartmargins. bottom)
				.append ("g")
				.attr("class", "chartcontainer")
				.attr("transform", "translate(" + chartmargins.left + "," + chartmargins.top + ")");

			//load data
			d3.csv("data/crime.csv", function(data) {

				data.forEach(function(d) {
					d.Date = dateFormat(d.Date);
				});	
			
				dataset = d3.keys(data[0])			//Create array of header
					.filter(function(key) {			// Filter out "Date"
						return key != "Date";
					})
					.map(function(q){				//Create another array inside first array
						return {
							name: q,
							amount: data.map (function(d) {
								return {
									x: d.Date,
									y: +d[q]
								};
							})
						};
					});

				stack(dataset); //apply stack
				
				//Set scale domains
				heightscale.domain([0, d3.max(dataset[dataset.length -1].amount,
					function(d){
						return(+d.y0 + +d.y) *1.1;
					})
				]);

				widthscale.domain([
					d3.min(dataset[dataset.length - 1].amount, function(d) {
						return +d.x;
					}),
					d3.max(dataset[dataset.length -1].amount, function(d) {
						return +d.x;
					})
				]);

				//creates group for area paths
				var areagroup = svg.append("g")
					.attr("class", "areagroup");

				//add area paths
				var beforearea = areagroup.selectAll("path")
					.data(dataset)
					.enter()
					.append("path")
					.attr ("class", function(d) {
						return d.name + " area";
					})
					.attr("d", function(d) {
		  			return areabefore(d.amount);
		  			})
					.attr("stroke", "none");
				
				var crimewaypoint = new Waypoint({
					element: document.getElementById('crimechart'),
					handler: function() {
					beforearea.transition()
						.duration(timer)
						.attr("d", function(d) {
			  			return area(d.amount);
			  			});
						crimewaypoint.disable();
					},
					offset: '60%'
				});					

				// call Y-axis
				svg.append("g")
					.attr("class", "y-axis axis")
					.call(yAxis);

				//call X-axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + height + ")")
					.call(xAxis);

				//add callouts
				var focus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var focustextback = focus.append("rect")
	      		    .attr('height', 30)
	      		    .attr('width', 100)
	                .attr('x', -50)
	                .attr('y', -40)
	                .attr("class", "focustextback");

	  			var focustext = focus.append("text")
	      			.attr("x", 0)
	     			.attr("dy", "-20")
	     			.attr("text-anchor","middle")
	     			.attr("class", "focustext");

	 			var focuscircle = focus.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Murder calloutcircle");

	     		var overlay = svg.append("rect")
	      			.attr("class", "overlay")
	      			.attr("width", width)
	      			.attr("height", height);

	      		mainoverlayhighlight();

	      		function overlayhighlight() {
	      			overlay.on("mouseover", function() { 
						focus.style("display", null); })
	      			.on("touchstart", function() { 
						focus.style("display", null); })
	      			.on("mouseout", function() { focus.style("display", "none"); })
	      			.on("touchend", function() { focus.style("display", "none"); })
	      			.on("mousemove", mousemove)
	      			.on("touchmove", mousemove)
	      		}

				function mousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-50) {
			 				focustextback.attr("transform", "translate(-50,0)");
			 				focustext.attr("transform", "translate(-50,0)");
			 			}
				    else if(widthscale(d.Date) < 50) {
			 				focustextback.attr("transform", "translate(50,0)");
			 				focustext.attr("transform", "translate(50,0)");
			 			}
			 		else{
			 				focustextback.attr("transform", "translate(0,0)");
			 				focustext.attr("transform", "translate(0,0)");
			 			}

				    if ($('#allcrimebutton').hasClass("active")) {
				     	focus.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto + +d.Rape + +d.Murder) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto + +d.Rape + +d.Murder,1)));
	   					}
	   				
	   				if ($('#grandlarcenybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.GrandLarceny) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.GrandLarceny,1)));
	   					}
	   				
	   				if ($('#felonyassaultbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.FelonyAssault) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.FelonyAssault,1)));
	   					}
	   				
	   				if ($('#robberybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Robbery) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.Robbery,1)));
	   					}
	   				
	   				if ($('#burglarybutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Burglary) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.Burglary,1)));
	   					}

	   				if ($('#grandlarcenyautobutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.GrandLarcenyAuto) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.GrandLarcenyAuto,1)));
	   					}

	   				if ($('#rapebutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Rape) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.Rape,1)));
	   					}

	   				if ($('#murderbutton').hasClass("active")){
	   			 		focus.attr("transform", "translate(" + widthscale(d.Date) + "," + heightscale(+d.Murder) + ")");
				    	focus.select("text")
				    	.text(scaleFormat(d.Date) + ": " + commaformat(d3.round(d.Murder,1)));
	   					}
				  }

				//add main callouts
				var mainfocus = svg.append("g")
	      			.attr("class", "focus")
	      			.style("display", "none");

	      		var mainfocusline = mainfocus.append("rect")
	      		    .attr("width", 2)
	      			.attr("height", height);

	      		var mainfocustextback = mainfocus.append("rect")
	      		    .attr('height', 160)
	      		    .attr('width', 152)
	                .attr('x', 10)
	                .attr('y', 105)
	                .attr("class", "focustextback");

	  			var mainfocustextbox = mainfocus.append("text")
	     			.attr("y", 125)
	     			.attr("text-anchor","start")
	     			.attr("class", "focustext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("id", "CrimeDatetext")
	     			.attr("font-weight", "500");

	       		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Murdertext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Rapetext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "GrandLarcenyAutotext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Burglarytext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "Robberytext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "FelonyAssaulttext");

	     		mainfocustextbox.append("tspan")
	     			.attr("x", 20)
	     			.attr("dy", "1.4em")
	     			.attr("id", "GrandLarcenytext");
	 			
	 			var GrandLarcenyfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "GrandLarceny calloutcircle")
	      			.style("display", "none");	  	      					
	 			
	 			var FelonyAssaultfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "FelonyAssault calloutcircle")
	      			.style("display", "none");
	 			
	 			var Robberyfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Robbery calloutcircle")
	      			.style("display", "none");
	 			
	 			var Burglaryfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Burglary calloutcircle")
	      			.style("display", "none");	   	      			
	 			
	 			var GrandLarcenyAutofocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "GrandLarcenyAuto calloutcircle")
	      			.style("display", "none");

	      		var  Rapefocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Rape calloutcircle")
	      			.style("display", "none");
	      		
	      		var  Murderfocuscircle = svg.append("circle")
	      			.attr("r", 6)
	      			.attr("class", "Murder calloutcircle")
	      			.style("display", "none");	

	     		function mainoverlayhighlight() {
	     			overlay.on("mouseover", function() { 
						mainfocus.style("display", null);
	      				Murderfocuscircle.style("display", null);
	      				Rapefocuscircle.style("display", "none");
	      				GrandLarcenyAutofocuscircle.style("display", null);
	      				Burglaryfocuscircle.style("display", null);
	      				Robberyfocuscircle.style("display", null);
	      				FelonyAssaultfocuscircle.style("display", null);
	      				GrandLarcenyfocuscircle.style("display", null);   
						})
	     			.on("touchstart", function() { 
						mainfocus.style("display", null);
	      				Murderfocuscircle.style("display", null);
	      				Rapefocuscircle.style("display", "none");
	      				GrandLarcenyAutofocuscircle.style("display", null);
	      				Burglaryfocuscircle.style("display", null);
	      				Robberyfocuscircle.style("display", null);
	      				FelonyAssaultfocuscircle.style("display", null);
	      				GrandLarcenyfocuscircle.style("display", null);   
						})
	      			.on("mouseout", function() { 
	      				mainfocus.style("display", "none");
	      				Murderfocuscircle.style("display", "none");
	      				Rapefocuscircle.style("display", "none");
	      				GrandLarcenyAutofocuscircle.style("display", "none");
	      				Burglaryfocuscircle.style("display", "none");
	      				Robberyfocuscircle.style("display", "none");
	      				FelonyAssaultfocuscircle.style("display", "none");
	      				GrandLarcenyfocuscircle.style("display", "none");    				
	      				})
	      			.on("touchend", function() { 
	      				mainfocus.style("display", "none");
	      				Murderfocuscircle.style("display", "none");
	      				Rapefocuscircle.style("display", "none");
	      				GrandLarcenyAutofocuscircle.style("display", "none");
	      				Burglaryfocuscircle.style("display", "none");
	      				Robberyfocuscircle.style("display", "none");
	      				FelonyAssaultfocuscircle.style("display", "none");
	      				GrandLarcenyfocuscircle.style("display", "none");    				
	      				})
	      			.on("mousemove", mainmousemove)
	      			.on("touchmove", mainmousemove);
	     		}

				function mainmousemove() {
				    var x0 = widthscale.invert(d3.mouse(this)[0]),
				        i = bisectDate(data, x0, 1),
				        d0 = data[i - 1],
				        d1 = data[i],
				        d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
				    
				    if(widthscale(d.Date) > width-152) {
			 				mainfocustextback.attr("transform", "translate(-172,0)");
			 				mainfocustextbox.attr("transform", "translate(-172,0)");
			 			}
			 		else{
			 				mainfocustextback.attr("transform", "translate(0,0)");
			 				mainfocustextbox.attr("transform", "translate(0,0)");
			 			}
					
					mainfocus.attr("transform", "translate(" + widthscale(d.Date) + ",0)");
					Murderfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto + +d.Rape + +d.Murder) + ")");
					Rapefocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto + +d.Rape) + ")");
					GrandLarcenyAutofocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto) + ")");
				    Burglaryfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary) + ")");
				    Robberyfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery) + ")");
				    FelonyAssaultfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny + +d.FelonyAssault) + ")");
				    GrandLarcenyfocuscircle.attr("transform", "translate(" + widthscale(d.Date) + "," + +heightscale(+d.GrandLarceny) + ")");
				    
				    mainfocus.select("#CrimeDatetext")
				    	.text( scaleFormat(d.Date)+": " + commaformat(d3.round(+d.GrandLarceny + +d.FelonyAssault + +d.Robbery + +d.Burglary + +d.GrandLarcenyAuto + +d.Rape + +d.Murder,1)));

				    mainfocus.select("#Murdertext")
				    	.text( "Murder: " + commaformat(d3.round(d.Murder,1)));
				    
				    mainfocus.select("#Rapetext")
				    	.text( "Rape: " + commaformat(d3.round(d.Rape,1)));
				    
				    mainfocus.select("#GrandLarcenyAutotext")
				    	.text( "GLA: " + commaformat(d3.round(d.GrandLarcenyAuto,1)));

				    mainfocus.select("#Burglarytext")
				    	.text( "Burglary: " + commaformat(d3.round(d.Burglary,1)));

				    mainfocus.select("#Robberytext")
				    	.text( "Robbery: " + commaformat(d3.round(d.Robbery,1)));
				    
				    mainfocus.select("#FelonyAssaulttext")
				    	.text( "Felony Assault: " + commaformat(d3.round(d.FelonyAssault,1)));

				    mainfocus.select("#GrandLarcenytext")
				    	.text( "Grand Larceny: " + commaformat(d3.round(d.GrandLarceny,1)));			    
				 }

				//buttton actions
				$('#allcrimebutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", false);
					
					setTimeout(function() {
						heightscale.domain([0, d3.max(dataset[dataset.length -1].amount,
							function(d){
								return(+d.y0 + +d.y) *1.1;
							})
						]);

					var beforearea = areagroup.selectAll("path")
						.data(dataset)
						.enter()
						.append("path")
						.attr ("class", function(d) {
							return d.name + " area";
						})
						.attr("d", function(d) {
			  			return areabefore(d.amount);
			  			})
						.attr("stroke", "none");

	      			focuscircle.attr("class","Murder calloutcircle");

	      			mainoverlayhighlight();

					beforearea.transition()
					.duration(timer)
					.attr("d", function(d) {
		  			return area(d.amount);
		  			});

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

				$('#grandlarcenybutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.GrandLarceny + 10000;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "GrandLarceny")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", GrandLarcenyArea);
	      			
	      			focuscircle.attr("class","GrandLarceny calloutcircle");

	      			overlayhighlight();

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

				$('#felonyassaultbutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.FelonyAssault + 5000;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "FelonyAssault")
						.attr("stroke", "none");

	      			focuscircle.attr("class","FelonyAssault calloutcircle");

	      			overlayhighlight();

					beforearea.transition()
					.duration(timer)
					.attr("d", FelonyAssaultArea);

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});
				
				$('#robberybutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.Robbery + 5000;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "Robbery")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", RobberyArea);

	      			focuscircle.attr("class","Robbery calloutcircle");

	      			overlayhighlight();

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

				$('#burglarybutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.Burglary + 5000;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "Burglary")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", BurglaryArea);

					focuscircle.attr("class","Burglary calloutcircle");

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

				$('#grandlarcenyautobutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.GrandLarcenyAuto + 5000;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "GrandLarcenyAuto")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", GrandLarcenyAutoArea);

	      			focuscircle.attr("class","GrandLarcenyAuto calloutcircle");

	      			overlayhighlight();

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});
				
				$('#rapebutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.Rape + 400;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "Rape")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", RapeArea);

	      			focuscircle.attr("class","Rape calloutcircle");

	      			overlayhighlight();

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

				$('#murderbutton').click(function(){
					areagroup.selectAll("path")
					.remove();

					d3.select("#felonylegend")
					.classed("hidden", true);
					
					setTimeout(function() {
						heightscale.domain([0,
							d3.max(data,function(d){return +d.Murder + 100;})
						]);

					beforearea = areagroup.selectAll("path")
						.data([ data ])
						.enter()
						.append("path")
						.attr("d", beforearea2)
						.attr("class", "Murder")
						.attr("stroke", "none");

					beforearea.transition()
					.duration(timer)
					.attr("d", MurderArea);

	      			focuscircle.attr("class","Murder calloutcircle");

	      			overlayhighlight();

					svg.select(".y-axis")
					.transition()
	    			.duration(timer)
	    			.call(yAxis);
					}, 50);
				});

			}); // End CSV load
		}  // End drawcrime line
	};

	// Draw charts intially and on resize
	charts.draw();
	$(window).resize( function(){
		if ($(window).width() !== windowwidth) {
			var scroll = $(window).scrollTop();
			throttle(charts.redraw(), 200);
			windowwidth = $(window).width();
			refreshbuttons();
			window.scroll(0, +scroll);

		}
	});
};

interactivewrapper();
