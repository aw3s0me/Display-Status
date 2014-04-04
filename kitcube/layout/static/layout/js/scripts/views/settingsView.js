define(['jquery', 'underscore', 'backbone', 'minicolors' , 'text!templates/settings.html'], function($, _, Backbone, minicolors, SettingsTemplate) {

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


		}
	})

	return settingsView;
}); 
