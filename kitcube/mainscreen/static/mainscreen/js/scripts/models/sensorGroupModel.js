define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection', 'models/baseWidgetModel'], function($, _, Backbone, SensorCollection, BaseModel) {
	var SensorGroupModel = BaseModel.extend({
		defaults: function(){
			return {
				type: "sensorgroup",
				bgcolor: undefined,
				collection: undefined,
				diffsensors: true,
				issortable: false
			}	
		},
		initialize: function(attr) {
			this.set({
				id: attr._id,
                name: attr['name'],
                size: attr['size'],
                coords: attr['coords'],
                diffsensors: attr['diffsensors'],
                cfgObj: attr,
                groupname1: attr["groupname1"],
                groupname2: attr["groupname2"],
                order: attr['order'],
                empties: attr['empties']
			});

			this.on('change: value', function() {
				//do smth
			});
		},
		setSensors: function (arr) {
			this.set({collection: new SensorCollection(arr)});
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