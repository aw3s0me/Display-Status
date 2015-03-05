define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection', 'models/baseWidgetModel'], function($, _, Backbone, SensorCollection, BaseModel) {
	var SensorTableModel = BaseModel.extend({
		defaults: function() {
			return {
				type: "sensortable",
				cols: undefined,
				groups: undefined,
				colids: undefined,
				colnames: undefined,
				showheaders: false,
				render: "table",
				minsize: [2, 2],
				scrolling: false
			}
		},
		initialize: function(options) {
			this.validate(options);

			this.set({
				id: options._id,
				size: options['size'],
				coords: options['coords'],
				colnames: options['colnames'],
				name: options['name'],
				render: options['render'],
				cfgObj: options
			});
		},
		validate: function (options) {
			if (!options._id)
				throw "Please specify id of sensortable";
			if (!options.size)
				throw "Please specify size of sensortable";
			if (!options.coords)
				throw "Please specify coords of sensortable";
			if (!options.name)
				throw "Please specify name of sensortable";
		},
		serToJSON: function() {
			var cfg = this.get('cfgObj');
			if (!cfg) {
				cfg = this.serFromModel();
			}

			cfg['size'] = this.get('size');
			cfg['coords'] = this.get('coords');

			return cfg;
		},
		serFromModel: function() {
			var listClone = this.clone();
			listClone.unset('id', {silent: true});

			var jsonAttr = {
				type: this.get('type'),
				size: this.get('size'),
				coords: this.get('coords'),
				cols: this.get('cols')
			};

			/*var collModels = this.get('groups').models;

			for (var i = 0; i < collModels.length; i++) {
				var model = collModels[i];
				jsonAttr[model.get('id')] = model.serToJSON();
			} */

			return jsonAttr;
		}
	});

	return SensorTableModel;

});
 
