/*global window, jasmine, require, phantom, console */
(function () {
    'use strict';

    var system = require('system'),
        args = system.args,
        config = require('./viewjazzle-config'),
        errorPrefix = 'ViewjazzleJS',
        index = 0,
        jsLibraryPath = config.jsLibraryPath,
        jasminePath = config.jasminePath,
        page,
        render = config.render,
        reporterName = config.reporterName,
        reporterPath = config.reporterPath,
        spec,
        testFailed = config.testMessages.testFailed,
        testSuiteFinished = config.testMessages.testSuiteFinished,
        timeout = config.timeout,
        url,
        cookie,
        viewports = config.viewports,
        ignoreMessages = config.ignoreMessages;

    if (!phantom) {
        console.log('PhantomJS is required to run ' + errorPrefix);
        return;
    }

    if (reporterName === 'ConsoleReporter' || reporterName === 'TerminalReporter') {
        console.log(reporterName + ' is not compatible with ' + errorPrefix + '. The reporter must be capable of grouped output similar to the TeamCity Reporter.');
        console.log('Feel free to customise your own reporter!');
        phantom.exit();
    }

    switch (args.length) {
        case 3:
            spec = args[1].replace(/\\/g, '/');
            url = args[2].replace(/\\/g, '/');
            break;
        case 4:
            spec = args[1].replace(/\\/g, '/');
            url = args[2].replace(/\\/g, '/');
            cookie = args[3].split(',');
            if (cookie.length % 2 !== 0) {
                console.log(errorPrefix + ': Specify cookies as name-value pairs, seperated by commas.');
                phantom.exit();
            }
            break;
        default:
            console.log(errorPrefix + ': Jasmine spec file and target page URL parameters not present.');
            phantom.exit();
    }

    if (undefined === viewports) {
        console.log(errorPrefix + ': Viewports array has not been defined - check the config.js file.');
        phantom.exit();
    }

    function getDomain(location) {
        var domain,
            domainStart,
            domainEnd;

        domainStart = location.indexOf('//') + 2;
        domain = location.substring(domainStart, location.length);
        domainEnd = domain.indexOf('/') !== -1 ? domain.indexOf('/') : domain.length;
        return domain.substring(0, domainEnd);
    }

    function isLoggable(msg) {
        var i;
        if (reporterName === 'TapReporter' && msg.indexOf(testSuiteFinished) !== -1) {
            return false; // exception - used in VJ Tap Reporter to track the test suite finished
        }

        for (i = 0; i < ignoreMessages.length; i += 1) {
            if (msg.indexOf(ignoreMessages[i]) !== -1) {
                // if this is a message we want to ignore from the array of defined messages
                return false;
            }
        }

        return true;
    }

    function closePage() {
        page.clearCookies();
        page.close();
    }

    function consoleMessage(msg) {
        var sPos, ePos, title;

        if (isLoggable(msg)) {
            console.log(msg);
        }

        // each test to run if not last
        if (index < viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            openPage();
        } else if (index === viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            phantom.exit();
        } else {
            if (msg.indexOf(testFailed) !== -1 && render) { // output for image capture
                if (reporterName === 'TeamcityReporter') {
                    sPos = msg.indexOf('name=') + 5;
                    ePos = msg.indexOf('message=') - 1;
                    msg = viewports[index - 1].width + 'x' + viewports[index - 1].height + msg.substring(sPos, ePos);
                }
                title = msg.replace(/\W/g, '-');
                page.render(errorPrefix + '-' + title + '-failed' + '.png');
            }
        }
    }

    function openPage() {

        var i,
            domain;

        page = require('webpage').create();

        if (cookie) {
            domain = getDomain(url);
            for (i = 0; i < cookie.length; i += 2) {
                phantom.addCookie({ 'name': cookie[i], 'value': cookie[i + 1], 'domain': domain });
            }
        }

        page.onConsoleMessage = consoleMessage;
        page.viewportSize = viewports[index];
        page.open(url, function (status) {
            page.injectJs(jasminePath + 'jasmine.js');
            page.injectJs(jasminePath + reporterPath);
            if (!!jsLibraryPath) {
                page.injectJs(jsLibraryPath);
            }
            page.injectJs(spec);
            page.evaluate(function (reporterName) {
                var jasmineEnv = jasmine.getEnv(),
                    jasmineReporter = jasmine[reporterName];
                jasmineEnv.addReporter(new jasmineReporter());
                jasmineEnv.execute();
            }, reporterName);

            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            } else {
                window.setTimeout(function () {
                    var details = 'The spec file exceeded the configured timeout. Increase the viewjazzle-config timeout value, and ensure you configured the correct path and parameters.',
                        message = errorPrefix + ': FAILED on ' + spec;

                    if (reporterName === 'TeamcityReporter') {
                        console.log("##teamcity[testStarted message='" + message + "' name='" + errorPrefix + "']");
                        console.log("##teamcity[" + testFailed + " message='" + message + "' name='" + errorPrefix + "' details='" + details + "']");
                        console.log("##teamcity[testFinished message='" + message + "' name='" + errorPrefix + "']");
                    } else if (reporterName === 'TapReporter') {
                        console.log(message + ' - ' + details);
                    }

                    phantom.exit();
                }, timeout);
            }

        });
        index += 1;
    }

    openPage();

}());