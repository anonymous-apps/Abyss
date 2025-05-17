# Metric Tests
Tests are in ./metric.test.ts

describe Metric Table Reference 
 - when we create a new metric, we should be able to get a reference to it through table.ref(id)
 - when we publish a metric object, we can call queryMetrics to get the metrics published as a result
 - when we publish a metrics object we can call get unique names to get the unique names of the metrics published
 - when we publish a metrics object we can call get unique dimensions to get the unique dimensions of the metrics published
 - when we wrap a failing function in a metric, we can see the metric object published with the failed metric
 - when we wrap a successful function in a metric, we can see the metric object published with the successful metric