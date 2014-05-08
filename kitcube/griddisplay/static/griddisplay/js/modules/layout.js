define([
        'jquery',
        'underscore',
        'Backbone',
        'common'
    ], function ($, _, Backbone){
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
