/*
 * This is NOT free software. You may learn from and experiment with this code but you may not redistribute it or use it in any commercial application without the explicit prior consent of the author.
 * Burak Kanber
 * burak@burakkanber.com
 * October 2012
 */

var canvas; 
var ctx;
var height = 400;
var width = 400;
var data = [];




var dataExtremes;
var dataRange;
var drawDelay = 500;


var iteration = 0;
var maxIterations;



var kPoints = [];
var pointIndexesWithCentroidLabels = [];
var k;

let data1 = "source/data/testData1_400x3_2-clusters.csv";
let data2 = "source/data/testData2_400x3_2-clusters.csv";
let data3 = "source/data/testData3_5600x5_x-clusters.csv";

    d3.csv(data1, function(csv_data) {
      data = normaliseData(csv_data);
      initialise();
    });



function initialise() {
    //For visuals
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    dataExtremes = getDataExtremes(data);
    dataRange = getDataRanges(dataExtremes);


    maxIterations = 20;
    k = 2;

    //Get initial k-points from random points in dataset
    kPoints = getInitialKPoints(data, k);
    
    updateLabelArray();
    
    
    
    draw();

    setTimeout(runKmeans, drawDelay);
}

//Clean the datapoints ny parsing them to float
function normaliseData(csv_input){
    let normalisedData = [];
     for (let i = 0; i < csv_input.length; i++) {
         let point = csv_input[i];
         let normalisedPoint = [];

       for (let dimension in point)
       {
           normalisedPoint.push(parseFloat(point[dimension]));
       }
         normalisedData.push(normalisedPoint);
     }   
   return normalisedData;
}

function getDataRanges(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}

function getDataExtremes(points) {
    
    var extremes = [];
    
    
     for (let i = 0; i < data.length; i++) {
          let point = data[i];

        for (var dimension in point)
        {
            if ( ! extremes[dimension] )
            {
                extremes[dimension] = {min: 1000, max: 0};
            }

            if (point[dimension] < extremes[dimension].min)
            {
                extremes[dimension].min = point[dimension];
            }

            if (point[dimension] > extremes[dimension].max)
            {
                extremes[dimension].max = point[dimension];
            }
        }
    }

    return extremes;

         
     }
    


function updateLabelArray() {

    for (var i in data)
    {
        var point = data[i];
        var distances = [];

        for (var j in kPoints)
        {
            var mean = kPoints[j];
            var sum = 0;

            for (var dimension in point)
            {
                var difference = point[dimension] - mean[dimension];
                difference *= difference;
                sum += difference;
            }

            distances[j] = Math.sqrt(sum);
        }

        pointIndexesWithCentroidLabels[i] = distances.indexOf( Math.min.apply(null, distances) );
    }


}

function moveCentroids() {

    updateLabelArray();

    var sums = Array( kPoints.length );
    var counts = Array( kPoints.length );
    var moved = false;

    for (var j in kPoints)
    {
        counts[j] = 0;
        sums[j] = Array( kPoints[j].length );
        for (var dimension in kPoints[j])
        {
            sums[j][dimension] = 0;
        }
    }

    for (var point_index in pointIndexesWithCentroidLabels)
    {
        var mean_index = pointIndexesWithCentroidLabels[point_index];
        var point = data[point_index];
        var mean = kPoints[mean_index];

        counts[mean_index]++;

        for (var dimension in mean)
        {
            sums[mean_index][dimension] += point[dimension];
        }
    }

    for (var mean_index in sums)
    {
        //console.log(counts[mean_index]);
        if ( 0 === counts[mean_index] ) 
        {
            sums[mean_index] = kPoints[mean_index];
            console.log("Mean with no points");
            console.log(sums[mean_index]);

            for (var dimension in dataExtremes)
            {
                sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
            continue;
        }

        for (var dimension in sums[mean_index])
        {
            sums[mean_index][dimension] /= counts[mean_index];
        }
    }

    if (kPoints.toString() !== sums.toString())
    {
        moved = true;
    }

    kPoints = sums;
    
    console.log(moved);
    console.log(iteration);

    return moved;

}

function runKmeans() {

    var moved = moveCentroids();
    draw();

    if (moved && iteration < maxIterations)
    {
        iteration++;
        setTimeout(runKmeans, drawDelay);
    }

}
function draw() {

    ctx.clearRect(0,0,width, height);

    ctx.globalAlpha = 1;
    for (var point_index in pointIndexesWithCentroidLabels)
    {
        var mean_index = pointIndexesWithCentroidLabels[point_index];
        var point = data[point_index];
        var mean = kPoints[mean_index];

        ctx.save();

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(
            (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.lineTo(
            (mean[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (mean[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.stroke();
        ctx.closePath();
    
        ctx.restore();
    }
    ctx.globalAlpha = 0.3;

    for (var i in data)
    {
        ctx.save();

        var point = data[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.strokeStyle = '#CCC';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    for (var i in kPoints)
    {
        ctx.save();

        var point = kPoints[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.fillStyle = 'green';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }

}




    ///Returns k number of points randomly picked
    function getInitialKPoints(data, k){
        let kPoints = [];
        let kPointIndexes =[];
    
        //Get k number of random indexes to fetch k-points from
        while (kPointIndexes.length < k) {
            //Get random int
            let randInt = getRandomInt(data.length-1)
            //Check that the k-point isn't already in the array of k-points
            if (!kPointIndexes.includes(randInt)) {
                kPointIndexes.push(randInt);
            }        
        }
        //Get the k-points from the data
        kPointIndexes.forEach(index => {
            kPoints.push(data[index]);
        });
        return kPoints;
    }


      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
