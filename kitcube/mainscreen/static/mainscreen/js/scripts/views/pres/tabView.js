define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var tabView = Backbone.View.extend({
        container: $('#tabs'),
        el: undefined,
        name: "",
        id: undefined,
        can_close: false,
        links: [],
        views: [],
        initialize: function(options) {
            if (options.name) {
                this.name = options.name;
            }
            if (options.id) {
                this.id = options.id;
            }
            if (options.id) {
                this.id = options.id;
            }
            if (options.can_close) {
                this.can_close = options.can_close;
            }
            if (options.links) {
                this.links = options.links;
            }
            this.render();

        },
        render: function() {

        },
        toggleGrid: function() {
            var holder = $("#tabs");
            var attr = holder.attr('grid');

            if (typeof attr !== 'undefined' && attr !== false) {
                holder.children('.grid').remove();
                holder.removeAttr('grid');
                return;
            }

            holder.attr('grid', 'grid');

            for (var i = 0; i < holder.data('gridSizeX'); i++)
                for (var j = 0; j < holder.data('gridSizeY'); j++) {
                    var e = this.newWidget(1, 1, i, j);
                    e.className = 'grid';
                    holder.append(e.outerHTML);
                }
            return;
        },
    });

    return tabView;
});
