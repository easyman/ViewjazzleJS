/**
 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js` and `jasmine_html.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
 */

(function () {

    /**
     * ## Require &amp; Instantiate
     *
     * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
     */
    window.jasmine = jasmineRequire.core(jasmineRequire);
    var env = jasmine.getEnv();
    var jasmineInterface = jasmineRequire.interface(jasmine, env);    

    window.setTimeout = window.setTimeout;
    window.setInterval = window.setInterval;
    window.clearTimeout = window.clearTimeout;
    window.clearInterval = window.clearInterval;

    var currentWindowOnload = window.onload;

    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }
    };

    /**
    * Add all of the Jasmine global/public interface to the proper global, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
    */
    if (typeof window == "undefined" && typeof exports == "object") {
        extend(exports, jasmineInterface);
    } else {
        extend(window, jasmineInterface);
    }

    /**
    * Helper function for readability above.
    */
    function extend(destination, source) {
        for (var property in source) destination[property] = source[property];
        return destination;
    }
}());