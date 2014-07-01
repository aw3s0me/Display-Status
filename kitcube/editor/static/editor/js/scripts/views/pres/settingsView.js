define(['jquery', 'underscore', 'backbone', 'text!templates/pres/settings.html'], function($, _, Backbone, SettingsTemplate) {

	var settingsView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var curData = window.activeSessionUser.get('cur_data_cfg');
			var compiledTemplate = _.template(SettingsTemplate, {});
			this.container.append(compiledTemplate);
			$('#picker').minicolors();
			this.el = $("#settingsContainer");
			this.el.hide();
		},
		setlabel: function(text) {

		},
		saveCfg: function() {
			//do serialize
			return "settings cfg save";
		},
		destroyView: function() {
			this.remove();
			this.el.remove();
  			this.unbind();
		}
	})

	return settingsView;
}); 
