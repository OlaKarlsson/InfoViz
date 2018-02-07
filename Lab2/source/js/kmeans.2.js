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

     //Get initial, k number of random k-points in the dataset
     let centroids = getInitialKPoints(data, k);


     //Create a new array with the data, npw labeled with the index of the closest k-Point/Centroid
    let dataWithClosestCentroid = getClosestCentroid(data, centroids);

    console.log(dataWithClosestCentroid[5]);

    computeClusterCenter(data, centroids);
    
    // let clusters = getClusters(dataWithClosestCentroid, kPoints);



   ///Returns a mean point of a cluster
   function computeClusterCenter(dataPoints, centroids) {
    let meanPoint = [];
    //For each of the points (each dimension), compute the mean/avg

    for (let j = 0; j < centroids.length; j++) {
        const element = centroids[j];
        let mean = d3.mean(dataPoints, function(d) { return d.closestCentroidIndex === j; });
        console.log(mean);
    }


    

    
    


    // for (let i = 0; i < dataPoints.length; i++) {
    //     const dataPoint = dataPoints[i];
        
    //     for (let j = 0; j < centroids.length; j++) {
    //         const centroid = centroids[j];

    //         let mean = d3.mean()
            
    //         //if the label of closest centroid matches the index of the centroid 
    //         if (dataPoint.closestCentroidIndex = j) {
    //             //Calculate the new centre/mean


    //         }

    //     }


    // }


    // for (let i = 0; i < datapointsInCluster[0].length; i++) {
    //     const value = d3.mean(datapointsInCluster, function(d) { return d[i]; })
    //     meanPoint.push(value);
    // }
    // return meanPoint;
    }


function getClosestCentroid(data, kPoints) {
    let dataWithClosest = [];

    data.forEach(function(d){
        d.closestCentroidIndex = findClosestCentroid(d, kPoints);
        dataWithClosest.push(d);
    });

    return dataWithClosest;
}


//Returns an array with the clusters
function getClusters(dataPoints, centroids) {
    let clusters = [];

    for (let i = 0; i < dataPoints.length; i++) {
        const dataPoint = dataPoints[i];

        for (let j = 0; j < centroids.length; j++) {
            const centroid = centroids[j];
            
        }
        
    }





    for (let i = 0; i < centroids.length; i++) {


        dataPoints.forEach(function(d){
            if (d.closestCentroidIndex === i) {
                
            }
        })


        const element = centroids[i];
        
    }


    dataPoints.forEach(function(){
        if (true) {
            
        }
    })




    centroids.forEach(function(centroid){
        let cluster = {};
        cluster.centroid = centroid;
        cluster.dataPoints = dataPoints.filter(function(d){
               return d.closestCentroid === centroid;
            });
        cluster.center = computeClusterCenter(cluster.dataPoints);

        clusters.push(cluster);
    });
    return clusters;
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




     /**
     * Find the centroid that is closest to the specified point.
     */
    //https://github.com/nl-hugo/d3-kmeans/blob/master/kmeans.js
    function findClosestCentroid(point, centroids) {
        let closest = {i: -1, distance: 2};//Instanciate closetst.distance higher than any of the points
        centroids.forEach(function(d, i) {
            let distance = getEuclidianDistance(d, point);
            // Only update when the centroid is closer
            if (distance < closest.distance) {
                closest.i = i;
                closest.distance = distance;
            }
        });
       // return (centroids[closest.i]); 
       return closest.i;
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


   
};

