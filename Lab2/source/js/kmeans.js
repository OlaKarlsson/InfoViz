/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself! 

     //1. 
    //2. Get k-points at random points in the data set (one per numbers of clusters specified) 
    //3. Loop through all points, find the closest k-point 
    //4. Assign each point to a cluster based on closest k-point
    //5. For each cluster, calculate centrum point of cluster, based on points in cluster
    //   do this by calculating the average/mean of the points in the cluster
    //6. Move Centroid to the centrum point
    //7. Keep doing this until points stop changing cluster

    /*
 * This is NOT free software. You may learn from and experiment with this code but you may not redistribute it or use it in any commercial application without the explicit prior consent of the author.
 * Burak Kanber
 * burak@burakkanber.com
 * October 2012
 */

// var canvas; 
// var ctx;
// var height = 400;
// var width = 400;
// var data = [];




// var dataExtremes;
// var dataRange;
// var drawDelay = 500;


var iteration = 0;
var maxIterations;



var kPoints = [];
var pointIndexesWithCentroidIndexLabels = [];
var k;


initialise();


function initialise() {
    //For visuals
    // canvas = document.getElementById('canvas');
    // ctx = canvas.getContext('2d');
    // dataExtremes = getDataExtremes(data);
    // dataRange = getDataRanges(dataExtremes);


    maxIterations = 20;
    k = 3;

    //Get initial k-points from random points in dataset
    kPoints = getInitialKPoints(data, k);
    
    updatePointIndexesWithCentroidIndexLabels();

    console.log(pointIndexesWithCentroidIndexLabels);
        
    
    
   // draw();

   // setTimeout(runKmeans, drawDelay);
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



function runKmeans() {

    var moved = moveCentroids();
    // draw();

    if (moved && iteration < maxIterations)
    {
        iteration++;
        setTimeout(runKmeans, drawDelay);
    }

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
    


function updatePointIndexesWithCentroidIndexLabels() {

    //Loop through all datapoints
    for (let i in data)
    {
        let point = data[i];
        let distances = [];


        //Loop through centroids
        for (let j in kPoints)
        {
            let centroid = kPoints[j];
            //For each dimenstion in the point, calculate the euclidian distance
            // for (let dimension in point)
            // {
            //     let difference = point[dimension] - centroid[dimension];
            //     difference *= difference;
            //     sum += difference;

                
            // }

            //For each dimenstion in the point, calculate the euclidian distance
            distances[j] = getEuclidianDistance(point, centroid)
            // distances[j] = Math.sqrt(sum);
        }

        //Assign the index of the smallest distance to the associative array
        pointIndexesWithCentroidIndexLabels[i] = distances.indexOf( Math.min.apply(null, distances) );
    }


}


 //Code, based on https://github.com/zeke/euclidean-distance

 function getEuclidianDistance(a, b) {
    return Math.sqrt(distanceSquared(a,b))
}

function distanceSquared(a, b) {
    let sum = 0
    Object.keys(a).forEach(key => {
        sum += Math.pow(a[key] - b[key], 2)
    });

    return sum
  }
///End code from https://github.com/zeke/euclidean-distance


function moveCentroids() {

    //Make sure the labels array is up to date
    updatePointIndexesWithCentroidIndexLabels();

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

    for (var point_index in pointIndexesWithCentroidIndexLabels)
    {
        var mean_index = pointIndexesWithCentroidIndexLabels[point_index];
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

    
      
   
};

