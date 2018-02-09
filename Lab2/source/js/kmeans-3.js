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
     var centroids = getInitialKPoints(data, k);

     var assignments = [];

     console.log("Centroids ");
     console.log(centroids);

     //Make an array which holds the cluster/centroid assignment of each datapoint
    //  assignments =  makeAssignments(data, centroids);
    //  console.log("Array which holds the cluster/centroid assignment of each datapoint ");
    //  console.log(assignments);

     moveCentroids(data, centroids, assignments);
     
     



     //Basing this version on https://burakkanber.com/blog/machine-learning-k-means-clustering-in-javascript-part-1/
     function moveCentroids(data, centroids, dataPointLabels) {

        dataPointLabels = makeAssignments(data, centroids);
    
       
        var sums = Array( centroids.length );
        var counts = Array( centroids.length );
        var moved = false;
    

        /////////////////


        for (let point_index = 0; point_index < dataPointLabels.length; point_index++) {
            var centroid_index_forDataPoint = dataPointLabels[point_index];
            var point = data[point_index];
            var centroid = centroids[centroid_index_forDataPoint];

            Object.keys(point).forEach(function(dimension){

                

            })
            // arrNewCentroid.push()
            
        }

        //Array to hold the points for each cluster/centroid
        var pointsInCluster = [];

       

        for (let j = 0; j < centroids.length; j++) {
            var newCentroid = [3];
            
            //For each cluster create a inner array to hold the points
            pointsInCluster[j] = [];
            for (let i = 0; i < data.length; i++) {

                //Check if the current datapoint belongs to the current cluster/centroid
               if (dataPointLabels[i] === j) {
                   //pointsInCluster[j].push(data[i]);
                   newCentroid[j] = [];

                   //For each dimension of the point
                   Object.keys(data[i]).forEach(function(dim) {

                    if (newCentroid[j][dim] === undefined) {
                        newCentroid[j][dim] = 0;
                    }else {
                        newCentroid[j][dim] += data[i][dim];
                    }
                   });

               }                
            }

            // let dimensionMeanForCluster

        }

        
        console.log(pointsInCluster);
        




        //For each centroid
        for (var j in centroids)
        {

            counts[j] = 0;
            sums[j] = Array( centroids[j].length );
            for (var dimension in centroids[j])
            {
                sums[j][dimension] = 0;
            }
        }
    
        for (var point_index in dataPointLabels)
        {
            var centroid_index_forDataPoint = dataPointLabels[point_index];
            var point = data[point_index];
            var centroid = centroids[centroid_index_forDataPoint];
    
            counts[centroid_index_forDataPoint]++;
    
            for (var dimension in centroid)
            {
                sums[centroid_index_forDataPoint][dimension] += point[dimension];
            }
        }
    
        for (var centroid_index_forDataPoint in sums)
        {
            // console.log(counts[centroid_index]);
            // if ( 0 === counts[centroid_index] ) 
            // {
            //     sums[centroid_index] = centroids[centroid_index];
            //     console.log("Mean with no points");
            //     console.log(sums[centroid_index]);
    
            //     for (var dimension in dataExtremes)
            //     {
            //         sums[centroid_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            //     }
            //     continue;
            // }
    
            for (var dimension in sums[centroid_index_forDataPoint])
            {
                sums[centroid_index_forDataPoint][dimension] /= counts[centroid_index_forDataPoint];
            }
        }
    
        if (centroids.toString() !== sums.toString())
        {
            moved = true;
        }
    
        centroids = sums;
    
        return moved;
    
    }





     function makeAssignments(data, centroids) {

        let assignments = [];
        //Loop through dataset
        for (var i in data)
        {
            var point = data[i];
            var distances = [];
    
            //For each datapoint, loop through the centroids
            //and calculate the Euclidean distance between the point and the centroid
            for (var j in centroids)
            {
                var centroid = centroids[j];
                var sum = 0;
    
                //For each dimension in a datapoint
                for (var dimension in point)
                {
                    var difference = point[dimension] - centroid[dimension];
                    difference *= difference;
                    sum += difference;
                }
    
                distances[j] = Math.sqrt(sum);
            }

            //for the current datapoint, set the smallest distance
            assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
        }

        return assignments;
    
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

