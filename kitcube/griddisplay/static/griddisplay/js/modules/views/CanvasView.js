define([
    'jquery', 
    'underscore', 
    'Backbone', 
    'text!templates/canvas/layout.html', 
    'text!templates/canvas/grid.html', 
    'common',
], function($, _, Backbone, layoutTemplate, gridTemplate, WidgetModel) {

    var CanvasView =  Backbone.View.extend({
        el: '.canvas',

        template: _.template(layoutTemplate, {id: 'test'}),

        render: function(sizeX, sizeY){
            this.initcanvas(sizeX, sizeY);
            this.initgrid();
            return this;
        },

        initcanvas: function(sizeX, sizeY) {
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

            this.$el.data('canvasUnit', unit0);
            this.$el.data('canvasSizeX', sizeX);
            this.$el.data('canvasSizeY', sizeY);
        },

        initgrid: function() {
            var unit = this.$el.data('canvasUnit');
            var sizeX = this.$el.data('canvasSizeX');
            var sizeY = this.$el.data('canvasSizeY');
            var template = _.template(gridTemplate);
            for (var i = 0; i < sizeX; i++) {
                for(var j = 0; j < sizeY; j++) {
                    this.$el.append(template({
                        top: j*unit, left: i*unit, // position
                        width: unit, height: unit  // size 
                    }));
                }
            }
            this.$el.attr('grid', 'grid');
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

        /*
        addWidget: function(pos, size, template, data) {
            data.posleft = pos.x;
            data.postop = pos.y;
            data.sizex = size.x;
            data.sizey = size.y;
            this.$el.append(_template(template, data));
        },
        */

        init: function(){
        },
    });

    return CanvasView;
});
