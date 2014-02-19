ViewjazzleJS
============

Use PhantomJS and Jasmine to test multiple viewports with TeamCity Console Reporter

ViewjazzleJS provides a mechanism for running Jasmine tests for multiple web UI screen sizes using PhantomJS.

* Defines a parametrised input to PhantomJS e.g. phantomjs viewjazzle.js [jasmine-spec-file] [target-url].
* Provides a configuration module to define the viewport sizes (responsive modes) and additional parameters.
* Option to render image of failed tests.
* Option to provide configuration of Jasmine Reporter with TeamCity - (you will need to write a custom reporter that can group tests in a similar way the TeamCity reporter does if you want to use ViewjazzleJS with any other Console Reporter).
