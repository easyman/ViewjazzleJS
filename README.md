ViewjazzleJS
============

ViewjazzleJS provides a mechanism for running Jasmine tests for multiple viewports (screen sizes) using PhantomJS.

Use PhantomJS and Jasmine to test multiple viewports with TeamCity Console Reporter

* Defines a parameterised input to PhantomJS e.g. phantomjs viewjazzle.js -url [target-url] -spec [jasmine-spec-file].
* Provides a configuration module to define the viewport sizes (responsive modes) and additional parameters.
* Option to render image of failed tests.
* Option to provide configuration of Jasmine Reporter with TeamCity.

Example command-line usage:

phantomjs viewjazzle.js -url http://web.viewjazzle.local/test.html -spec spec/test.js