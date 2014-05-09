require.config({
    paths: {
        'text': 'libs/require/text',
        'models': 'modules/models',
        'views': 'modules/views',
        'collections': 'modules/collections',
        'templates': 'templates',
        'jquery': 'libs/jquery/jquery',
        'underscore': 'libs/underscore/underscore',
        'Backbone': 'libs/backbone/backbone',
        'common': 'libs/common',
    },
/*
    shim: {
        'underscore': {
            'exports': '_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        },
    }
*/
});

require(['modules/test'], function(test) {
    test.test();
});

/*
require(['modules/views/CanvasView'], function(CanvasView) {
    var canvas = new CanvasView();
    canvas.init();
});
*/

require(['modules/canvas'], function(canvas) {
    canvas.init();
});

