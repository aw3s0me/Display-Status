define(['jquery', 'underscore', 'backbone', 'models/sensorModel'], function($, _, Backbone, Sensor) {
	var SensorGroupCollection = Backbone.Collection.extend({
		id: undefined,
		model: Sensor,
		initialize: function(models, options) {
			options || (options = {});
			if (options.id) {
				this.id = options.id;
			}
		},
		serToJSON: function() {
			//need to write some code
		},
		get: function(name) {
			return this[name];
		},
		paramToChart: function() {
			var models = this.models;
			var dataToChart = [];
			for (var modelId in models) {
				var myModel = models[modelId];
				dataToChart.push(myModel.getChartProperties());
			}
			return dataToChart;
		}
	});

	return SensorGroupCollection;
});
 
