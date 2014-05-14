define([
    'views/CanvasView',
    'views/WidgetView',
], function(CanvasView, WidgetView) {
    canvas = new CanvasView();
    widget = new WidgetView({el: '.canvas'});

    var init = function() {
        canvas.render(2, 1).togglegrid();
        widget.render();
    };

    return {
        init: init,
    };
});
