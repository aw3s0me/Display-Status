define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var tabView = Backbone.View.extend({
        container: undefined,
        el: undefined,
        name: "",
        id: undefined,
        can_close: false,
        tabLink: undefined, //jquery link <li>
        links: [],
        views: [],
        grid: undefined,
        initialize: function(options) {
            if (options.name) {
                this.name = options.name;
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
            if (options.container) {
                this.container = options.container;
            }
            this.render();
        },
        initializeGrid: function() {
            if (!this.grid) {
                this.grid = new kitGrid(this.el);
                console.log('init grid:');
                console.log(this.id);
                console.log(this.grid.getIdOfCanvas());
            }
        },
        render: function() {
            this.tabLink = $(_.template('<li><a link="<%= id%>" href="#<%= id%>"><%=name %></a></li>', { id: this.id, name: this.name }));
            this.el = $(_.template('<div class="gridTab" id="<%= id%>"></div>', { id: this.id }));

            this.container.find('ul').append(this.tabLink);
            this.container.append(this.el);
        },
        removeFromDom: function() {
            this.el.remove();
            this.remove();
        },
        findElement: function(elemId) {
            return $.inArray(elemId, this.links);
        }
    });

    return tabView;
});
