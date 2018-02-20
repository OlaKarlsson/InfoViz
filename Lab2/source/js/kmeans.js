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


var iteration = 1;
var maxIterations;



var kPoints = [];
var pointIndexesWithCentroidIndexLabels = [];
var k;


initialise();
runKmeans();


function initialise() {
    //For visuals
    // canvas = document.getElementById('canvas');
    // ctx = canvas.getContext('2d');
    // dataExtremes = getDataExtremes(data);
    // dataRange = getDataRanges(dataExtremes);


    maxIterations = 20;

    //Get initial k-points from random points in dataset
    kPoints = getInitialKPoints(data, k);
    
    updatePointIndexesWithCentroidIndexLabels();

    console.log(pointIndexesWithCentroidIndexLabels);
        
    
    
   // draw();

   // setTimeout(runKmeans, drawDelay);
}


function runKmeans() {

    var moved = moveCentroids();
    // draw();

    console.log(moved);
    console.log(iteration);


    if (moved && iteration < maxIterations)
    {
        console.log("Run again");
        
        iteration++;
        runKmeans();
    }

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


var sse = {};
for (let i = 0; k < kPoints.length; k++) {
    const element = kPoints[k];
    
    sse[k]=0;

}



function checkQuality() {
    //array with quality for the clusters
    var sse = [];
    for (let k = 0; k < kPoints.length; k++) {
        const element = kPoints[k];      


        //For each cluster, get mean
//for each datapoint in each cluster, += Math.pow(datapoint-mean, 2)

    }
    
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
   // updatePointIndexesWithCentroidIndexLabels();

    var summed_dimensions = Array( kPoints.length );
    var counts = Array( kPoints.length );
    var moved = false;

    //For each kpoint/cluster
    for (var j in kPoints)
    {
        
        //instanciate the counts array with zeros, one for each kpoint
        counts[j] = 0;
        summed_dimensions[j] = Array( Object.keys(kPoints[j]).length );
        for (var dimension in kPoints[j])
        {
            //instanciate the the dimensions of the sum array with zeros
            summed_dimensions[j][dimension] = 0;
        }
    }

    //For each element in the array with indexes of points and the cluster the belong to
    for (var point_index in pointIndexesWithCentroidIndexLabels)
    {
        var centroid_index = pointIndexesWithCentroidIndexLabels[point_index];
        var point = data[point_index];
        var centroid = kPoints[centroid_index];

        counts[centroid_index]++;

        for (var dimension in centroid)
        {
            summed_dimensions[centroid_index][dimension] += point[dimension];
        }
    }

    for (var centroid_index in summed_dimensions)
    {
        console.log(counts[centroid_index]);
        if ( 0 === counts[centroid_index] ) 
        {
            summed_dimensions[centroid_index] = kPoints[centroid_index];
            console.log("Mean with no points");
            console.log(summed_dimensions[centroid_index]);

            // for (var dimension in dataExtremes)
            // {
            //     sums[mean_index][dimension] = 0 + ( Math.random() * dataRange[dimension] );
            // }
            continue;
        }

        // for (let i = 0; i < datapointsInCluster[0].length; i++) {
        //     const value = d3.mean(datapointsInCluster, function(d) { return d[i]; })
        //     meanPoint.push(value);
        // }


        for (var dimension in summed_dimensions[centroid_index])
        {
            summed_dimensions[centroid_index][dimension] /= counts[centroid_index];
        }
    }

    if (kPoints.toString() !== summed_dimensions.toString())
    {
        moved = true;
    }

    kPoints = summed_dimensions;

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

