define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        self: this,
        initialize: function() {
            this.render();
            this.on('loadingfinished', function(data) {
                console.log(data);
            });
        },
        render: function() {
            this.el = $('#lblFromNow');
        }

    });

    return userPanelView;

}) 
