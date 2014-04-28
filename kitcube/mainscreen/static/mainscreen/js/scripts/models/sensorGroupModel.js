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
			diffsensors: true
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: value', function() {
				//do smth
			});
		},
		serToJSON: function() {
			var sensorGroupClone = this.clone();
			var collection = this.get('collection').models;
			sensorGroupClone.unset('id', {silent: true});
			var jsonAttr = {
				"type": this.get('type'),
				"size": this.get('size'),
				"coords": this.get('coords')
			}
			if (this.get('diffsensors') === false) {
				

				jsonAttr['diffsensors'] = this.get('diffsensors');
				//jsonAttr['dbgroup'] = ;
				//jsonAttr['dbname'] = ;
				//jsonAttr['server'] = ;
			}

			jsonAttr['sensors'] = [];

			for (var i = 0; i < collection.length; i++) {
				var sensor = collection[i];
				var jsonSensorAttr = {};
				var options = {
					'diffsensors' : this.get('diffsensors'),
					'type': 'group'
				}

				jsonSensorAttr = sensor.serToJSON(options);

				//jsonAttr.push()
			}



			return _.clone(sensorClone.attributes);
		}
	});

	return SensorGroupModel;

}); 
