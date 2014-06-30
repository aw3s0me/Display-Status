define(['jquery', 'underscore', 'backbone', 'chosen', 'text!templates/pres/controlPanel.html'], function($, _, Backbone, Chosen, ControlPanelTemplate) {

	var ControlPanelView = Backbone.View.extend({
		//container: $('#wrapper'),
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(ControlPanelTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#controlPanel');
			$(".nav-header").click(function () {
		        $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
		        $(this).next().slideDown()
		    });
			
			//$(element).chosen();
		}
	})

	return ControlPanelView;
});