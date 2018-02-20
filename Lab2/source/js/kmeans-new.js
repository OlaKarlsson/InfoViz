/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself! 

    var centroids = [];

    //Loop through the number of k-points
    for (let i = 0; i < k; i++)
    {
        //Get random int in the data range
        let c = Math.floor(Math.random() * data.length);
        //use the random int as index to get random point in the dataset
        //and set the inital centroids
        centroids.push(Object.values(data[c]));
    }

    var numberOfDimensions = Object.keys(data[0]).length;
   

    var result = {
        assignments: []
    };


    //Summera distans i kluster
    

    var clusterCounts = [];
    clusterCounts.length = k;

    var clusterSums = [];
    clusterSums.length = k;
    for (var i = 0; i < k; i++) {
        clusterSums[i] = new Array(numberOfDimensions);
    }

    var didCentroidChange = 1;
    while (didCentroidChange) {
        clusterCounts.fill(0);
        didCentroidChange = 0;

        for (var i = 0; i < k; i++) {
            clusterSums[i].fill(0);
        }
        // MOAR FOR CYCLES!!!1!!
        for (var i = 0; i < data.length; i++) {
            var closestCentroid = -1;
            var closestCentroidDistance = Number.MAX_SAFE_INTEGER;
            for (var j = 0; j < k; j++) {
                var distance = euclideanDistance(Object.values(data[i]), centroids[j]);
                if (distance < closestCentroidDistance) {
                    closestCentroidDistance = distance;
                    closestCentroid = j;
                }
            }
            var currentValues = Object.values(data[i]);
            for (var j = 0; j < numberOfDimensions; j++) {
                clusterSums[closestCentroid][j] += parseFloat(currentValues[j]);
            }
            clusterCounts[closestCentroid]++;
            if (result.assignments[i] != closestCentroid) {
                result.assignments[i] = closestCentroid;
                didCentroidChange = 1;
            }
        }
        //recalculate centroid position
        for (var i = 0; i < k; i++) {
            for (var j = 0; j < numberOfDimensions; j++) {
                centroids[i][j] = clusterSums[i][j] / clusterCounts[i];
            }
        }
    }

    //Calculate the Euclidian sitance between two points
    function euclideanDistance(a, b) {
        let returnValue = 0;
        for (var i = 0; i < a.length; i++) {
            returnValue += Math.abs(a[i] - b[i]) * Math.abs(a[i] - b[i]);
        }
        return Math.sqrt(returnValue)
    }

    return result;
};
