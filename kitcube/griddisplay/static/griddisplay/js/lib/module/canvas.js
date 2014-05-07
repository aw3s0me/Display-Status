define(['jquery', 'underscore'], function() {
    var CanvasView = Backbone.View.extend({
        el: '.canvas',

        initialize: function() {
            this.render();
        },

        render: function() {
            var that = this;
            $.get('templates/griddisplay/canvas.html', function() {
                var template = _.template({});
                that.$el.html(template);
            }, 'html');
        }
    });

    var canvas = new CanvasView();
});
