define(['jquery', 'underscore', 'backbone', 'views/widgets/baseWidgetView'], function($, _, Backbone, BaseWidgetView) {

    var webCamModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: undefined,
                type: "webcam",
                size: [],
                name: "",
                coords: []
            }
        },
        initialize: function (attr) {
            this.set({
                id: attr['id'],
                size: attr['size'],
                coords: attr['coords']
            });

        }
    });

    var WebCamView = BaseWidgetView.extend({
        initialize: function(attr) {
            this.widgetController = attr.wc;
            this.board = this.widgetController.board;
            this.grid = this.widgetController.getGrid(attr);
            this.model = new webCamModel(attr);
            this.render();
            this.widgetController.addViewToLookup(attr['type'], this);
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
