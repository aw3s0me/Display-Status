define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection'], function($, _, Backbone, SensorCollection) {
	var SensorTableModel = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				type: "sensortable",
				size: [],
				coords: [],
				cols: undefined,
				groups: undefined,
				colids: undefined,
				colnames: undefined,
				showheaders: false,
				render: "table",
				minsize: [2, 2],
				scrolling: false,
				cfgObj: null
			}
		},
		initialize: function() {
			//options || (options = {});
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
			}

			var collModels = this.get('collection').models;

			for (var i = 0; i < collModels.length; i++) {
				var model = collModels[i];
				jsonAttr[model.get('id')] = model.serToJSON();
			}

			return jsonAttr;
		}
	});

	return SensorTableModel;

});
 
