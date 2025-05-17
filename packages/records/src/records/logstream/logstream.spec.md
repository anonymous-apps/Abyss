# Logstream Tests
Tests are in ./logstream.test.ts

### Logstream Table 
 - we can get a logstream referance by id
 - we can create a new logstream with a source type and source id
 - scanning
  - we can scan all logstreams by source type
  - we can scan all logstreams by source id

### Logstream Record
 - Adding messages
  - we can add log, warn, error, success, fail messages to a logstream
  - success messages will complete the logstream
  - fail messages will fail the logstream
