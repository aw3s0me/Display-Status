define([
    'jquery', 
    'underscore', 
    'Backbone', 
    'common',
], function($, _, Backbone) {

    var WidgetModel = Backbone.Model.extend({
        defaults: {
            position: {x: 0, y: 0}, 
        },
    });

    return WidgetModel;
});
