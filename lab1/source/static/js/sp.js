/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

/*
Completed by Ola Karlsson Jan 25 2018
Using code samples from
https://github.com/kristin-henry-sf/d3_experiments/tree/master/scatterPlotResponsive_d3v4

*/

function sp(data){

    this.data = data;
    var scatterDiv = '#scatter-plot';
    var brush;

    var height = 500;
    var parentWidth = $(scatterDiv).parent().width();
    var legendWidth = 100;
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left - legendWidth,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(scatterDiv).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var r = d3.scaleLinear().range([0, 10]);//Set scaling for circle radius 

    //Creating an object to more easily pass around the scales
    var scales = {
        xScale: x,
        yScale: y,
        rScale: r
    }


    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes
       x and y domain code here*/

    var xValue = "Employment_rate";
    var yValue = "Household_income";
    var circleSize = "Life_satisfaction";
    var colourValue = "Country";

    var xAxisLabel = xValue;
    var yAxisLabel = yValue;

    x.domain(d3.extent(data, function (d) { return d[xValue]; }));//Set max and min for X axis
    y.domain(d3.extent(data, function (d) { return d[yValue]; }));//Set max and min for Y axis
    r.domain(d3.extent(data, function (d) { return d[circleSize]; }));//Set min and max for radius of circles


    var svg = d3.select(scatterDiv).append("svg")
        .attr("width", width + margin.left + margin.right + legendWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .on("click", function(d){
            console.log("clicked");
            clearBrushedEffect();
            map.reset();
        });

        /* ~~ Task 3 Add the x and y Axis and title  ~~ */
        drawAxises(scales, xAxisLabel, yAxisLabel);
       


        /* ~~ Task 4 Add the scatter dots. ~~ */
        var circles = drawChart(data);


        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */
        addBrush();


       //Added legend showing the colour and which colour is which country
       // drawLegend(data);
       //Turned out there wasn't enough room


        function addBrush() {
            brush = d3.brush()
            .on("brush", highlightBrushedCircles);
    
            svg.append("g")
               .attr("class", ".brush")
                .call(brush);
        }


        function drawChart(data) {
            //console.log(data);
            return svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot non_brushed")
            .attr("r", function(d){ return r(d[circleSize]); })
            .attr("cx", function(d) { return x(d[xValue]); })
            .attr("cy", function(d) { return y(d[yValue]); })
            .style("fill", function(d) { return color(d[colourValue]); });
        }

        //Function to draw the axises
        function drawAxises(theScales, xLabel, yLabel){

        svg.append("g")
        .attr('id', 'x_axis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(theScales.xScale))

          svg.append("text")
            .attr('id', 'xlabel')
            .attr('transform',
                  'translate(' + width + ' ,' +
                  (height  -6) + ')') 
            .style('text-anchor', 'end')
            .text(xLabel)
            
      
          svg.append("g")
            .attr('id', 'y_axis')
            .call(d3.axisLeft(theScales.yScale))

          svg.append("text")
            .attr('id', 'ylabel')
            .attr('y', 9)
            .attr("transform", "rotate(-90)")//Rotate it to make it fit by the line
            .style("text-anchor", "end")
            .text(yLabel);

        }

//Experimented with creating a legend but 
//there's not enough room
        // function drawLegend(data){
        //     var legend = svg.selectAll(".legend")
        //         .data(color.domain())
        //       .enter().append("g")
        //         .attr("class", "legend")
        //         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
          
        //     legend.append("rect")
        //         .attr("x", width + legendWidth)
        //         .attr("width", 18)
        //         .attr("height", 18)
        //         .style("fill", color);
        //         //.on("click", function(d){ updateFromLegend(d, this);});
          
        //     legend.append("text")
        //         .attr("x", width + legendWidth - 24)
        //         .attr("y", 9)
        //         .attr("dy", ".35em")
        //         .style("text-anchor", "end")
        //         .text(function(d) { return d; });
        //   }

function clearBrushedEffect(){
    circles.attr("class", "non_brushed");
}


         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             
             if (d3.event.selection != null) {
                // console.log("in highlightBrushedCircles");
                 // revert circles to initial style
                 circles.attr("class", "non_brushed");
                 var brush_coords = d3.brushSelection(this);
                 // style brushed circles
                   circles.filter(function (){
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                  })
                  .attr("class", "brushed");
                   var d_brushed =  d3.selectAll(".brushed").data();

                   /* ~~~ Call pc or/and map function to filter ~~~ */
                   map.selectCountry(d_brushed);
             }
         }//highlightBrushedCircles

         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed


         this.reset = function(){
            clearDots();
            drawAxises(scales, xAxisLabel, yAxisLabel);
            drawChart(this.data);
         }

         function clearDots(){
            svg.selectAll(".dot").remove();
         }

        //  function clearBrush(){
        //     svg.select(".selection").call(brush.move, null);
        //  }

         //Select all the dots filtered
         this.selectDots = function(value){
            //clearBrush();
            //Clear previous dots
            clearDots();
            console.log(value);
            //Create a filtered array based on selection from map
            var selectedCountries = data.filter(function(d){
                return d.Country === value.properties.name;
            });            
            drawChart(selectedCountries);
            addBrush();
            //console.log(selectedCountries);



          
           //Initial attempt, showing the selected dots by adding a stroke
            // var dots = d3.selectAll(".dot")
            // .style("stroke", function (d) {
            //    // console.log(d);
            //     if( Object.prototype.toString.call( value ) === '[object Array]' ) {
            //         console.log("Array");
            //     }else{
            //         //If it's not an array it's coming from a click on the map
            //         //console.log("Not Array");
            //         if (d.Country.toLowerCase().replace(/ /g, "-") === value.properties.name.toLowerCase().replace(/ /g, "-") ) {
            //             return "#8e1b54";
            //         }
            //     }
            // });
         };


}//End
