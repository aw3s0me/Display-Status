define(['jquery', 'underscore', 'backbone', 'text!templates/settings.html'], function($, _, Backbone, SettingsTemplate) {

	var settingsView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(SettingsTemplate, {});
			this.container.append(compiledTemplate);
			$('#picker').minicolors();
			this.el = $("#settingsContainer");
			this.el.hide();
		},
		hide: function() {
			this.el.hide();
		},	
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if(this.el.is(':hidden')) {
				return true;
			}
			else 
				return false;
		},
		isShown: function() {
			if(this.el.is(':hidden')) {
				return false;
			}
			else 
				return true;
		}
	})

	return settingsView;
}); 
