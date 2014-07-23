define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var webCamModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: undefined,
                type: "webcam",
                size: [],
                name: "",
                coords: []
            }
        }
    });

    var WebCamView = Backbone.View.extend({
        container: undefined,
        grid: undefined,
        model: undefined,
        board: undefined,
        initialize: function(attr) {
            this.grid = attr.grid;
            this.model = new webCamModel({
                id: attr['id'],
                size: attr['size'],
                coords: attr['coords']
            }); 
            this.render();
        },
        render: function() {
            this.container = "<div style='width: 100%; height: 100%;' id='webcam_" + this.model.get('id') + "'>" + 
            "<img style='width: 100%; height: 100%;' src='/static/mainscreen/images/webcam/ccamer.png' />" +
            "</div>";

            this.grid.addUnit(this.container, {
                border: 0,
                transparent: true,
                //draggable: model.get('isdraggable'),
                //resizable: model.get('isresizable')
            }, this.model);


        }
    });

    return WebCamView;
});
