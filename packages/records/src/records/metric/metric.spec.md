# Metric Tests
Tests are in ./metric.test.ts

Useful Utilities:
 - get a clean and empty metric table
 - a metric table with a single metric
 - a metric table with multiple diverse metrics including generating many samples of each metric

### Metric Table Reference 
 - when we create a new metric object
    - we can use a key value map without dimensions and see they are all published
    - we can use a key value map with dimensions and see the dimensions are associated with each metric
 - when wrap a function in a metric
    - we can see the metric object published when metric is successful
    - we can see the metric object published when metric is failed
    - we see our own dimensions added to the metric object
    - we see custom dimensions added to the metric object for duration and ran
 - when we call getUniqueDimensionsForMetric
    - we see no dimensions for an unknown metric name
    - we see no dimensions for a metric with no dimensions
    - we see the dimensions for a metric with dimensions
 - when we call queryMetrics
    - we get no results for an unknown metric name
    - we get all values of a metric if we pass in no dimensions
    - we get all values of a metric that match one dimension if we pass in one dimension
    - we get all values of a metric that match all dimensions if we pass in many dimensions
 - when we call getUniqueNames
    - we get no results if there are no metrics
    - we get all unique names if we have metrics