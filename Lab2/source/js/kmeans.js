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



var iteration = 1;
var maxIterations;


var kPoints = [];
var pointIndexesWithCentroidIndexLabels = [];
var k;
var distances = [];
var quality = 0;
var previousClusterDistance = Number.MAX_SAFE_INTEGER;



initialise();
runKmeans();
var result = {
    assignments: pointIndexesWithCentroidIndexLabels
};
return result;


function initialise() {
  
    maxIterations = 20;

    //Get initial k-points from random points in dataset
    kPoints = getInitialKPoints(data, k);
    
    updatePointIndexesWithCentroidIndexLabels();
    
}


function runKmeans() {

    var moved = moveCentroids();
    
//End up with 0 because calling it in the wrong place, same as why it claimes it only moves two times
    let quality = checkQuality();

    console.log(moved);
    console.log(iteration);
    console.log(pointIndexesWithCentroidIndexLabels);


    if (moved && iteration < maxIterations)
    {
        console.log("Run again");
        
        iteration++;
        runKmeans();
    }

}


//Clean the datapoints by parsing them to float
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




function checkQuality() {

   var summedClusterDistance = 0;
   for (let k = 0; k < kPoints.length; k++) {
    

        for (let j = 0; j < data.length; j++) {
             let dataPoint = data[j];
             let clusterIndex = pointIndexesWithCentroidIndexLabels[j];
             let closestCentroid = data[clusterIndex];
             
             summedClusterDistance += getEuclidianDistance(closestCentroid,dataPoint);
                          
        }       
       
   }

   let quality = previousClusterDistance - summedClusterDistance;

    if (previousClusterDistance > summedClusterDistance) {
        previousClusterDistance = summedClusterDistance;
    }

   
   return quality;

  
        
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
            distances[j] = getEuclidianDistance(point, centroid)
        }

        let indexOfClosestCentroid = distances.indexOf( Math.min.apply(null, distances) )
        //Assign the index of the smallest distance to the associative array
        pointIndexesWithCentroidIndexLabels[i] = indexOfClosestCentroid;
        
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

