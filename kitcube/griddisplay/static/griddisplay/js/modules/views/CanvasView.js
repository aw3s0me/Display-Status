define([
    'jquery', 
    'underscore', 
    'Backbone', 
    'text!templates/canvas/layout.html', 
    'text!templates/canvas/grid.html', 
    'common',
], function($, _, Backbone, layoutTemplate, gridTemplate) {

    var CanvasView =  Backbone.View.extend({
        el: '.canvas',

        template: _.template(layoutTemplate, {id: 'test'}),

        initgrid: function(sizeX, sizeY) {
            var canvasWidth = $(window).width(),
                canvasHeight = $(window).height()
                    - $('.banner').css('height').toNum()
                    - $('.footer').css('height').toNum();
            console.log(canvasWidth, canvasHeight);

            var wgt = canvasWidth * 0.96,
                hgt = canvasHeight * 0.96,
                unitX = Math.round(wgt / sizeX),
                unitY = Math.round(hgt / sizeY),
                unit0 = (unitY < unitX) ? unitY : unitX,
                margintop = (canvasHeight - unit0*sizeY)/2.;
            console.log(wgt, hgt, unit0, margintop);

            this.$el.css('margin-top', margintop+'px');
            this.$el.css('height', sizeY*unit0 + 'px');
            this.$el.css('width', sizeX*unit0 + 'px');

            this.$el.data('gridUnit', unit0);
            this.$el.data('gridSizeX', sizeX);
            this.$el.data('gridSizeY', sizeY);
        },

        render: function(sizeX, sizeY){
            this.initgrid(sizeX, sizeY);
            //this.$el.html(this.template);
            var unit = this.$el.data('gridUnit');
            var gridtpl = _.template(gridTemplate);
            for (var i = 0; i < sizeX; i++) {
                for(var j = 0; j < sizeY; j++) {
                    this.$el.append(gridtpl({
                        top: j*unit, left: i*unit, width: unit, height: unit
                    }));
                }
            }
            console.log(unit);
            return this;
        },

        togglegrid: function() {
            var attr = this.$el.attr('grid');
            if (typeof attr !== 'undefined' && attr !== false) {
                this.$el.children('.grid').hide();
                this.$el.removeAttr('grid');
                return this;
            } else {
                this.$el.children('.grid').show();
                this.$el.attr('grid', 'grid');
                return this;
            }
        },

        init: function(){
        },
    });

    return CanvasView;
});
