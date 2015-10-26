/*global window, console */
(function () {
    'use strict';

    var failureCount = 0;
    window.jasmine.customReporter = {
        jasmineStarted: function (suiteInfo) {
            console.log('Started  : Spec with ' + suiteInfo.totalSpecsDefined + ' tests');
        },
        suiteStarted: function (result) {
            console.log('Suite    : ' + result.fullName);
            //console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
        },
        specDone: function (result) {
            var i,
                status = result.status.toUpperCase();

            if (status !== 'FAILED') {
                console.log('> ' + result.status.toUpperCase() + ' : ' + result.description);
            }

            for (i = 0; i < result.failedExpectations.length; i += 1) {
                console.log('> ' + status + ' : ' + result.fullName + '. ' + result.failedExpectations[i].message);
                failureCount += 1;
                //console.log(result.failedExpectations[i].stack);
            }
        },
        jasmineDone: function () {
            console.log('Finished : ' + failureCount + ' failure(s) found');
            console.log('jasmineDone');
        }
    };
}());