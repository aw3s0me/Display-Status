define([
        'jquery',
        'underscore',
        'common',
        'text!templates/index.html',
    ], function ($, _){
        var init = function () {
            $(document).ready(function() {
                var canvasWidth = $(window).width();
                var canvasHeight = $(window).height()
                        - $('.banner').css('height').toNum()
                        - $('.footer').css('height').toNum();
                console.log(canvasWidth, canvasHeight);
            });
        };
        return {init: init};
    }
);
