define(['jquery', 'underscore', 'backbone', 'text!templates/pres/settings.html'], function($, _, Backbone, SettingsTemplate) {

	var settingsView = Backbone.View.extend({
		container: $('#guiEditor'),
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
		setlabel: function(text) {

		},
		saveToServ: function() {
			var self = this;
			var testUrl = '';
		}
	})

	return settingsView;
}); 
