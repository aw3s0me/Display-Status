define(['jquery', 'underscore', 'backbone', 'chosen','text!templates/controlPanel.html'], function($, _, Backbone, Chosen, ControlPanelTemplate) {

	var ControlPanelView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(ControlPanelTemplate, {});
			this.container.append(compiledTemplate);
			
    		//$(element).chosen();
		}
	})

	return ControlPanelView;
});

