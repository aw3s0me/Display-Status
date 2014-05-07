require.config({
    paths: {
        'jquery': 'lib/vendor/jquery',
        'underscore': 'lib/vendor/underscore',
        'test': 'lib/test',
        'common': 'lib/common',
    }
});

require(['test'], function(test) {
    test.test();
});

require(['jquery', 'common'], function() {
    $(document).ready(function() {
        var canvasWidth = $(window).width();
        var canvasHeight = $(window).height()
                    - $('.banner').css('height').toNum()
                    - $('.footer').css('height').toNum();
        console.log(canvasWidth, canvasHeight);
    });
});

