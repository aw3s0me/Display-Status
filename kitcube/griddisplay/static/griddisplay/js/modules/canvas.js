define([
    'views/CanvasView',
    'views/SensorView',
], function(CanvasView, SensorView) {
    canvas = new CanvasView();

    var init = function() {
        canvas.render(40, 20).togglegrid();
        //canvas.togglegrid();
    };

    var togglegrid = function() {
        canvas.togglegrid();
    };

    return {
        init: init,
        toggle: togglegrid,
    };
});
