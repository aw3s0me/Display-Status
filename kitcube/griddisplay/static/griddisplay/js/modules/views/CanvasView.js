define([
    'jquery', 
    'underscore', 
    'Backbone', 
    'text!templates/canvas/layout.html', 
], function($, _, Backbone, Template) {
    var canvasView =  Backbone.View.extend({
        el: '.canvas',
        template: _.template(Template, {id: 'test'}),
        render: function(){
            console.log(typeof this);
            this.$el.html(this.template);
            return this;
        },
        init: function(){
            console.log(this);
            this.render();
        },
    });
    return canvasView;
});
