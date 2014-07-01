define(['jquery', 'underscore', 'backbone', 'text!templates/pres/settings.html', 'models/settingsModel'], function($, _, Backbone, SettingsTemplate, SettingsModel) {

	var settingsView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		model: undefined,
		initialize: function() {
			this.render();
		},
		initModel: function(initCfg) {
			for (var propName in initCfg) {
				var property = initCfg[propName];
			}
		},
		render: function() {
			var curCfg = JSON.parse(window.activeSessionUser.get('cur_data_cfg'));
			var dataSources = curCfg['datasources'];
			var screenCfg = curCfg['screen'];
			this.model = new SettingsModel();
			if (dataSources) {
				this.model.set({
					host: dataSources['host'],
					dbgroup: dataSources['dbgroup'],
					dbname: dataSources['dbname'],
					server: dataSources['server']
				});
			}
				

			if (screenCfg)
				this.model.set({
					bgcolor: "#DCDCDC",
					isfluid: false,
					isscrollable: false,
					sizecoeff: 2,
					boardsizex: 60,
					boardsizey: 25,
					footerheight: '8%',
					bannerheight: '15%',
					resolution: [],
				})

			var compiledTemplate = _.template(SettingsTemplate, {

			});
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
