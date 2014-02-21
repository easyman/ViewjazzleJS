ViewjazzleJS
============

ViewjazzleJS provides a mechanism for running Jasmine tests for multiple viewports (screen sizes) using PhantomJS.

Use PhantomJS and Jasmine to test multiple viewports with TeamCity Console Reporter

* Defines a parameterised input to PhantomJS e.g. phantomjs viewjazzle.js [jasmine-spec-file] [target-url].
* Provides a configuration module to define the viewport sizes (responsive modes) and additional parameters.
* Option to render image of failed tests.
* Option to provide configuration of Jasmine Reporter with TeamCity.

_You will need to write a custom reporter that can group tests in a similar way to the custom TeamCity reporter if you want to use ViewjazzleJS with any other Jasmine console reporter. An example custom Tap reporter is also provided in the repo._
