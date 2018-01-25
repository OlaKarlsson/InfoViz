/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data){

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var legendWidth = 100;
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left - legendWidth,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var r = d3.scaleLinear().range([0, 10]);//Set scaling for circle radius 

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


    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right + legendWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        /* ~~ Task 3 Add the x and y Axis and title  ~~ */
        drawAxises();
       


        /* ~~ Task 4 Add the scatter dots. ~~ */
        var circles = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("class", "non_brushed")
        .attr("r", function(d){ return r(d[circleSize]); })//Circles got to big so, scaling them down
        .attr("cx", function(d) { return x(d[xValue]); })
        .attr("cy", function(d) { return y(d[yValue]); })
        .style("fill", function(d) { return color(d[colourValue]); });


        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */

        var brush = d3.brush()
        .on("brush", highlightBrushedCircles);

        svg.append("g")
            .call(brush);


            drawLegend(data);



        //Function to draw the axises
        function drawAxises(){

            svg.append("g")
            .attr('id', 'x_axis')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

          svg.append("text")
            .attr('id', 'xlabel')
            .attr('transform',
                  'translate(' + width + ' ,' +
                  (height  -6) + ')') 
            .style('text-anchor', 'end')
            .text(xAxisLabel)
            
      
          svg.append("g")
            .attr('id', 'y_axis')
            .call(d3.axisLeft(y))

          svg.append("text")
            .attr('id', 'ylabel')
            .attr('y', 9)
            .attr("transform", "rotate(-90)")//Rotate it to make it fit by the line
            .style("text-anchor", "end")
            .text(yAxisLabel);

        }


        function drawLegend(data){
            var legend = svg.selectAll(".legend")
                .data(color.domain())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
          
            legend.append("rect")
                .attr("x", width + legendWidth)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);
                //.on("click", function(d){ updateFromLegend(d, this);});
          
            legend.append("text")
                .attr("x", width + legendWidth - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
          }




         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             if (d3.event.selection != null) {
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

             }
         }//highlightBrushedCircles
         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed



         //Select all the dots filtered
         this.selecDots = function(value){

         };


}//End
