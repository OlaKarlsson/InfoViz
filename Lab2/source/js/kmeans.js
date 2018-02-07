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

     console.log(centroids);

     assignments =  makeAssignments(data, centroids);
     console.log(assignments);
     
     


     function makeAssignments(data, centroids) {

        let assignments = [];
        for (var i in data)
        {
            var point = data[i];
            var distances = [];
    
            for (var j in centroids)
            {
                var centroid = centroids[j];
                var sum = 0;
    
                for (var dimension in point)
                {
                    var difference = point[dimension] - centroid[dimension];
                    difference *= difference;
                    sum += difference;
                }
    
                distances[j] = Math.sqrt(sum);
            }
    
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

