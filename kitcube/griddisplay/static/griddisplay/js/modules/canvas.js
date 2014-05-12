define([
    'views/CanvasView',
    'views/SensorView',
], function(CanvasView, SensorView) {
    canvas = new CanvasView();

    var init = function() {
        canvas.render(60, 40).togglegrid();
    };

    var togglegrid = function() {
        canvas.togglegrid();
    };

    return {
        init: init,
        toggle: togglegrid,
    };
});
