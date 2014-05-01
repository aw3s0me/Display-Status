define(['jquery', 'underscore', 'backbone', 'chosen', 'text!templates/controlPanel.html'], function($, _, Backbone, Chosen, ControlPanelTemplate) {

	var ControlPanelView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(ControlPanelTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#controlPanel');
			//$(element).chosen();
		},
		hide: function() {
			this.el.hide();
		},
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if (this.el.is(':hidden')) {
				return true;
			} else
				return false;
		},
		isShown: function() {
			if (this.el.is(':hidden')) {
				return false;
			} else
				return true;
		}
	})

	return ControlPanelView;
});