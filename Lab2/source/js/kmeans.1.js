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

    //TEST DATA - REMOVE AFTER TESTING
    var testK = 3;
    var testData = [[0.046411,0.005578,0.056284],
    [0.057604,0.0231,0.045996],   
    [0.0493,0.066032,0.075602],
    [0.042381,0.068068,0.083975],
    [0,0.082557,0.043702],
    [0.064346,0.03588,0.018753],
    [0.087897,0.083112,0.085976],
    [0.067844,0.035395,0.079979],
    [0.06578,0.074357,0.036737],
    [0.10003,0.04989,0.074798]];
    k= testK;
    data = testData;
    //TEST DATA - REMOVE AFTER TESTING

    
    //Get initial, random k-points
    let kPoints = getKPoints(data, k);
    //Create an array with all the datapoints but label them with which k-point/centroid is closest
    let dataPointsWithClosestCentroid = getDataPointsWithCentroidsLabel(data, kPoints);
    //Based on which k-point/centroid is closest, create an array with the clusters
    let clusters = getClusters(dataPointsWithClosestCentroid, kPoints);
    console.log(clusters);    

    getErrorLEvel(clusters[0]);

    //https://youtu.be/9991JlKnFmk?t=10m50s
    // var sse = {};
    // for (let k = 0; k < clusters.length; k++) {
    //     const cluster = clusters[k];
    //     sse[k]=0;

        
    // }

    function getErrorLEvel(cluster) {
        cluster.dataPoints.forEach(function(dataPoint){

            delete dataPoint.closestCentroid;
            let sse = Math.pow(dataPoint - cluster.center, 2);
            
            console.log(sse);
            

        });
    }




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



    ///Returns a mean point of a cluster
    function computeClusterCenter(datapointsInCluster) {
        let meanPoint = [];
        //For each of the points (each dimension), compute the mean/avg
        for (let i = 0; i < datapointsInCluster[0].length; i++) {
            const value = d3.mean(datapointsInCluster, function(d) { return d[i]; })
            meanPoint.push(value);
        }
        return meanPoint;
    }

   
    


    function getDataPointsWithCentroidsLabel(dataPoints, centroids) {

        let dataPointsWithCentroidsLabel = [];

        dataPoints.forEach(function(dataPoint){
            dataPoint.closestCentroid = findClosestCentroid(centroids, dataPoint)
            // console.log(dataPoint);
            
            dataPointsWithCentroidsLabel.push(dataPoint);

        });  
        
        return dataPointsWithCentroidsLabel;
    }



   // function checkDistances(dataPoints, kPoints){
        
        //Loop though all dataPoints
   //     dataPoints.forEach(function(dataPoint){
            
            //per datapoint, loop through the k-points and check the distance
            
            // let distances = [];
            // for (let i = 0; i < kPoints.length; i++) {
            //     const kPoint = kPoints[i];

            //     let distance = 

            //     distances.push(getEuclidianDistance(dataPoint, kPoint));
            // }

            // let closestDistance = Array.min(distances);

            // console.log(closestDistance);
            

            //Now we have an array distances, with the distance to each k-point from the current dagtapoint



        

            
            // for (let i = 0; i < kPoints.length; i++) {
            //     //for every k-point do this
            //     const kPoint = kPoints[i];
            //     let distance = getEuclidianDistance(dataPoint, kPoint);

            //     let distanceA = getEuclidianDistance(dataPoint, kPoint);

            //     if (i===0) {
            //         distanceA = distance;
            //     }else if(i===1) {
            //         distanceB = distance;

            //     } else if(i===2) {
            //         distanceC = distance;

            //     }
                
            //         console.log(distanceA); 
            //         console.log(distanceB); 
            //         console.log(distanceC); 


            // }

            // kPoints.forEach(function(kPoint){
            //     let distance = getEuclidianDistance(dataPoint, kPoint);
            //     console.log(distance);                
            // });
   //     });


 //   }


    // console.log(pointsWithClusterLabel);


//    data.forEach(point=>{
     
//        //Check

//        for (let index = 0; index < point.length; index++) {
//            const element = point[index];
           
//        }

//    });





   



// console.log("euclidean-distance: "+ getEuclidianDistance([0.057604,0.0231,0.045996], [0.10003,0.04989,0.074798]));


   // console.log(data);

   
};



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
    

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }


    
function getKPoints(data, k){
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


//https://github.com/zeke/euclidean-distance
function getEuclidianDistance(a, b) {
  return Math.sqrt(distanceSquared(a,b))
}


function distanceSquared(a, b) {
    let sum = 0
    let n
    for (n = 0; n < a.length; n++) {
      sum += Math.pow(a[n] - b[n], 2)
    }
    return sum
  }
  

  function log(value){
      console.log(value);
  }

   //https://stackoverflow.com/questions/8934877/obtain-smallest-value-from-array-in-javascript
  Array.min = function( array ){
    return Math.min.apply( Math, array );
};