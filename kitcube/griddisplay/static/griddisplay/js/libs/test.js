define(['underscore', 'jquery'], function() {
    var test = function () {
        if (typeof jQuery == 'undefined') {
            console.log('jQuery not loaded');
        } else {
            console.log('jQuery loaded');
        }
    };

    return {
        test: test
    };
});
