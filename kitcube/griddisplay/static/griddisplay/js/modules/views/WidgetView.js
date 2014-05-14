define([
    'jquery', 
    'underscore', 
    'Backbone', 
    'common',
], function($, _, Backbone) {
  var WidgetView = Backbone.View.extend({
    //el: '.canvas',

    className: 'widget',

    tagName: 'div',

    template: _.template("<div style='width: 200px; height: 100px'></div>"),

    render: function() {
      this.$el.append(this.template());
      return this;
    },

    appendTo: function(target) {
      this.$el.appendTo(target);
    }
  });

  return WidgetView;
});
