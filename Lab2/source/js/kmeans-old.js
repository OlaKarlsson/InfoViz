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


    //Get initial, random k-points
    let kPoints = getInitialKPoints(data, k);

    //Create an array with all the datapoints but label them with which k-point/centroid is closest
    let dataPointsWithClosestCentroid = getDataPointsWithCentroidsLabel(data, kPoints);

    //Array with the clusters 
    let clusters = getClusters(dataPointsWithClosestCentroid, kPoints);

    console.log(clusters);

    getQuality(clusters[0]);



    function getQuality(cluster){
        



        let distance = 0;
        cluster.dataPoints.forEach(function(dataPoint){
            
            distance += getEuclidianDistance(cluster.centroid, dataPoint.point);
        });

        console.log(distance);

    }
    


    //Returns an array with the clusters
    function getClusters(dataPoints, centroids) {
        let clusters = [];

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



    function getDataPointsWithCentroidsLabel(dataPoints, centroids) {

        let dataPointsWithCentroidsLabel = [];

        dataPoints.forEach(function(dataPoint){
            let thePoint = [];
            for (i = 0; i < dataPoint.length; i++) {
                thePoint.push(dataPoint[i]);
            }
            dataPoint.point = thePoint;
            dataPoint.closestCentroid = findClosestCentroid(centroids, dataPoint)
                        
            dataPointsWithCentroidsLabel.push(dataPoint);

        });  
        return dataPointsWithCentroidsLabel;
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

      ///Returns a mean point of a cluster
      function computeClusterCenter(datapointsInCluster) {
        let meanPoint = [];

  //Loop through values in each key
  Object.keys(datapointsInCluster[0]).forEach(function(key){
    const value = d3.mean(datapointsInCluster[key]);
    meanPoint.push(value);

});




        //For each of the points (each dimension), compute the mean/avg
        for (let i = 0; i < datapointsInCluster.length; i++) {
            const dataPoint = datapointsInCluster[i];

        }
        return meanPoint;
    }


      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }



     /**
     * Find the centroid that is closest to the specified point.
     */
    //https://github.com/nl-hugo/d3-kmeans/blob/master/kmeans.js
    function findClosestCentroid(centroids, point) {
        let closest = {i: -1, distance: 2};//Instanciate closetst.distance higher than any of the points
        centroids.forEach(function(d, i) {
            let distance = getEuclidianDistance(d, point);
            // Only update when the centroid is closer
            if (distance < closest.distance) {
                closest.i = i;
                closest.distance = distance;
            }
        });
        return (centroids[closest.i]); 
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

