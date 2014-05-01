define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection'], function($, _, Backbone, SensorCollection) {
	var SensorGroupModel = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			type: "sensorgroup",
			size: [],
			coords: [],
			bgcolor: undefined,
			collection: undefined,
			diffsensors: true,
			dbgroup: undefined,
			dbname: undefined,
			server: undefined,
			cfgObj: null
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: value', function() {
				//do smth
			});
		},
		serToJSON: function() {
			var collection = this.get('collection').models;

			var cfg = this.get('cfgObj');

			if (!cfg) {
				cfg = this.serFromModel();
			} else {
				delete cfg['_id'];

				cfg['size'] = this.get('size');
				cfg['coords'] = this.get('coords');
				cfg['sensors'] = [];

				for (var i = 0; i < collection.length; i++) {
					var sensor = collection[i];
					var jsonSensorAttr = {};
					var options = {
						'diffsensors': this.get('diffsensors'),
						'type': 'group'
					}

					jsonSensorAttr = sensor.serToJSON(options);

					cfg['sensors'].push(jsonSensorAttr);
				}
			}

			return cfg;
		},
		serFromModel: function() {
			var collection = this.get('collection').models;

			var jsonAttr = {
				"type": this.get('type'),
				"size": this.get('size'),
				"coords": this.get('coords')
			}
			if (this.get('diffsensors') === false && (this.get('dbgroup') !== undefined && this.get('dbname') !== undefined && this.get('server') !== undefined)) {
				jsonAttr['diffsensors'] = this.get('diffsensors');
				jsonAttr['dbgroup'] = this.get('dbgroup');
				jsonAttr['dbname'] = this.get('dbname');
				jsonAttr['server'] = this.get('server');
			}

			if (this.get('bgcolor') !== undefined) {
				jsonAttr['bgcolor'] = this.get('bgcolor');
			}

			jsonAttr['sensors'] = [];

			for (var i = 0; i < collection.length; i++) {
				var sensor = collection[i];
				var jsonSensorAttr = {};
				var options = {
					'diffsensors': this.get('diffsensors'),
					'type': 'group'
				}

				jsonSensorAttr = sensor.serToJSON(options);

				jsonAttr['sensors'].push(jsonSensorAttr);
			}

			return jsonAttr;
		}
	});

	return SensorGroupModel;

});