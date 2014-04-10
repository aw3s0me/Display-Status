define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Sensor = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			type: "sensor",
			comment: undefined,
			unit: undefined,
			value: "NaN",
			lastTime: undefined,
			max: undefined,
			min: undefined,
			alarm: undefined,
			server: undefined,
			device: undefined,
			dbname: undefined,
			dbgroup: undefined,
			mask: undefined,
			values: undefined,
			size: [],
			coords: [],
			bgcolor: undefined,
			valUnit: "NaN"
		},
		initialize: function() {
			//console.log("model created");
			this.set({valUnit: this.get('value') + " " + this.get('unit')});
			this.on('change: value', function() {
				this.set({valUnit: this.get('value') + " " + this.get('unit')});
			});
		},
		getChartProperties: function() {
			return {
				"name": this.get('name'),
				"data": this.get('values')
			}
		},
		getDbUrl: function() {
			return 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + this.get('server') +'&db_name=' + this.get('dbname') + '&db_group='+ this.get('dbgroup') +'&db_mask='+ this.get('mask') +'&window=-1';
		},
		serToJSON: function() {
			var sensorClone = this.clone();
			sensorClone.unset('id', {silent: true});
			sensorClone.unset('values', {silent: true});
			sensorClone.unset('value', {silent: true});
			sensorClone.unset('lastTime', {silent: true});
			return _.clone(sensorClone.attributes);
		}
	});

	return Sensor;

});