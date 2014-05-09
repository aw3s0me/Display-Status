define([
    'views/CanvasView',
], function(CanvasView) {
    /*
    var init = function () {
        $(document).ready(function() {
            var canvasWidth = $(window).width();
            var canvasHeight = $(window).height()
                    - $('.banner').css('height').toNum()
                    - $('.footer').css('height').toNum();
            console.log(canvasWidth, canvasHeight);
        });
    };
    */
    var init = function() {
        var canvas = new CanvasView();
        canvas.init();
    };
    return {init: init};
});
