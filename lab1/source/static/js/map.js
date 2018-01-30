/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
  Completed by Ola Karlsson 29/1-2018
*/
function map(data, world_map_json){

    this.data = data;
    this.world_map_json = world_map_json;

    this.selectedCountry = "";
  
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
            //Check if a country has been selected, if so clear the selection
            if (this.selectedCountry !== "") {
                this.selectedCountry = "";
                //Call reset on Scatterplot
                sp.reset();                
            }
        });
  
    var g = svg.append("g");
  
  
    var countries = topojson.feature(world_map_json,
          world_map_json.objects.countries).features;
  
    //console.log(countries);
    var country = g.selectAll(".country")
    .data(countries);
  
    /*~~ Task 12  initialize color array ~~*/
    var cc = [];

  data.forEach(function (d) { 
      cc[d["Country"]] = d3Colors(d["Country"]); 
    });

  
    country.enter().insert("path")
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
        })
  
        //selection
        .on("click",  function(d) {
            /*~~ call the other graphs method for selection here ~~*/

            //Stop the clik event from bubbling up to parent
            d3.event.stopPropagation();
            console.log(d);
            //Set a 
            selectedCountry = d;
            //Call the selectDots on the Scattterplot
            sp.selectDots(d);           
        
        });
  
    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }
  
      /*~~ Highlight countries when filtering in the other graphs~~*/
    this.selectCountry = function(collection){
      //  console.log(collection);
       // d3.select(this).style('stroke','white');

       collection.forEach(function(item){
          // console.log(item.Country);

           //The names where added as IDn on the map countries
           //Then I here loop and  
            d3.select("#"+item.Country.toLowerCase().replace(/ /g, "-")).style("fill","blue");

        
       })

       
    }
  
  }  