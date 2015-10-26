/*global window, console */
(function () {
    'use strict';

    function escapeTeamcityString(message) {
        if (!message) {
            return '';
        }

        return message
                .replace(/\|/g, "||")
                .replace(/\'/g, "|'")
                .replace(/\n/g, "|n")
                .replace(/\r/g, "|r")
                .replace(/\u0085/g, "|x")
                .replace(/\u2028/g, "|l")
                .replace(/\u2029/g, "|p")
                .replace(/\[/g, "|[")
                .replace(/\]/g, "|]");
    }

    window.jasmine.customReporter = {
        suiteStarted: function (result) {
            console.log("##teamcity[testSuiteStarted name='" + escapeTeamcityString(result.fullName) + "']");
        },

        specStarted: function (result) {
            console.log("##teamcity[testStarted name='" + escapeTeamcityString(result.description) + "']");
        },

        specDone: function (result) {
            var i;

            for (i = 0; i < result.failedExpectations.length; i += 1) {
                console.log("##teamcity[testFailed name='" + escapeTeamcityString(result.description) + "' message='FAILED' details='" + escapeTeamcityString(result.fullName + ". " + result.failedExpectations[i].message) + "']");
            }
            console.log("##teamcity[testFinished name='" + escapeTeamcityString(result.description) + "']");
        },

        suiteDone: function (result) {
            if (result.fullName.indexOf('Jasmine__TopLevel__Suite') === 0) {
                return;
            }
            console.log("##teamcity[testSuiteFinished name='" + escapeTeamcityString(result.fullName) + "']");
        },

        jasmineDone: function () {
            console.log('jasmineDone');
        }
    };
}());