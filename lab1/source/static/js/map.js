/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
  Completed by Ola Karlsson 29/1-2018
*/
function map(data, world_map_json){

    this.data = data;
    this.world_map_json = world_map_json;

    var selectedCountry = "";
  
    var div = '#world-map';
    var parentWidth = $(div).parent().width();
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = parentWidth - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;
  
    /*~~ Task 10  initialize color variable ~~*/
    var d3Colors = d3.scaleOrdinal(d3.schemeCategory20);


    //initialize zoom
    var zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', move);
  
    //initialize tooltip
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
  
    /*~~ Task 11  initialize projection and path variable ~~*/
    var merceratorProjection = d3.geoMercator()
    // .translate([width/2, height/2]);
    .center([100, 10])
    .scale(100);
    //Instructions said other numbers but found that to show as much as possible these were better 

    var path = d3.geoPath()
    .projection(merceratorProjection);


    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("click", function(d){
            // console.log("Selected Country");
            // console.log(selectedCountry);
            //Check if a country has been selected, if so clear the selection
            if (selectedCountry !== "") {
                selectedCountry = "";
                //Call reset on Scatterplot
                sp.reset();                
            }
        });
  
    var g = svg.append("g");
  
  
    var countries = topojson.feature(world_map_json,
          world_map_json.objects.countries).features;
  
 /*~~ Task 12  initialize color array ~~*/
    var cc = [];
    data.forEach(function (d) { 
        cc[d["Country"]] = d3Colors(d["Country"]); 
    });

    drawMap(countries);
    
    function drawBackground(data){

        g.selectAll(".bg-country")
        .data(data)
        .enter()
        .insert("path")
        .attr("class", "bg-country")
        .attr("d", path)
        .style("stroke", "#CCC");
    }

   function drawMap(data){

    //First clear old stuff
    g.selectAll(".country").remove();

    //console.log(data);
        //console.log(countries);
        var country = g.selectAll(".country")
        .data(data)
        .enter().insert("path")
            .attr("class", "country country-map")
            /*~~ Task 11  add path variable as attr d here. ~~*/
            .attr("d", path)
            .attr("id", function(d) { return d.properties.name.toLowerCase().replace(/ /g, "-"); })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) { return cc[d.properties.name]; })
    
            //tooltip
            .on("mousemove", function(d) {
            d3.select(this).style('stroke','blue');
    
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
            tooltip
            .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
            .html(d.properties.name);
            })
            .on("mouseout",  function(d) {
    
                d3.select(this).style('stroke','#CCC');
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })//selection
            .on("click",  function(d) {
                /*~~ call the other graphs method for selection here ~~*/
                //Stop the click event from bubbling up to parent
                d3.event.stopPropagation();
                //Set a country as the selectd country
                selectedCountry = d;
                //console.log(selectedCountry);
                //Call the selectDots on the Scattterplot
                sp.selectDots(d);           
            });            
        }
    

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    function clearColouredMap(){
        g.selectAll(".country").remove();
    }

    this.reset = function(){
        console.log("In reset");
        clearColouredMap();
        drawMap(countries);
    }
  
      /*~~ Highlight countries when filtering in the other graphs~~*/
    this.selectCountry = function(collection){
         console.log(collection);

        if (collection.length>0) {
             //Clear the coloured map
             clearColouredMap();

            var theCountries = [];
            countries.forEach(function(outerItem){
                // console.log(item);
                collection.forEach(function(innerItem){
                        if (outerItem.properties.name == innerItem.Country) {
                            theCountries.push(outerItem);
                        }
                    });
            });
            console.log("Filtered countries");
            console.log(theCountries);
            drawBackground(countries);
            drawMap(theCountries);
        }else{
            this.reset();
        }
       


       // d3.select(this).style('stroke','white');
       // drawMap(collection);
    //    var selectedCountries = data.filter(function(d){
    //     return d.Country === value.properties.name;
    //     });  

    //    collection.forEach(function(item){
    //       // console.log(item.Country);

    //        //The names where added as IDn on the map countries
    //        //Then I here loop and stroke the correct ones
    //         d3.select("#"+item.Country.toLowerCase().replace(/ /g, "-")).style("fill","blue");
    //    });
       
    }
  
  }  