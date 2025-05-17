# Settings Tests
Tests are in ./settings.test.ts

### Settings Table Reference 
- when we get the default settings
  - it will return the default settings object if it already exists
  - it will create the default settings if they don't exist
- when we update the default settings
  - it will update the default settings object if it already exists
  - it will create the default settings if they don't exist
- when we call ref()
  - it will return a reference to the default settings