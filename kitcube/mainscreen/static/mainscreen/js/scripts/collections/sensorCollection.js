define(['jquery', 'underscore', 'backbone', 'models/sensorModel'], function($, _, Backbone, Sensor) {
	var SensorGroupCollection = Backbone.Collection.extend({
		id: undefined,
		model: Sensor,
		group: undefined,
		rowId: undefined,
		initialize: function(models, options) {
			options || (options = {});
			if (options.id) {
				this.id = options.id;
			}
			if (options.group) {
				this.group = options.group;
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
		},
		getDataToTable: function() {
			var models = this.models;
			var dataToTable = [];
			var objToPush = {};

			for (var i = 0; i < models.length; i++) {
				if (this.group)
					objToPush['groupname'] = this.group;
				//var value = models[i].get('value') === undefined ? 0: models[i].get('value');
				objToPush[models[i].get('id')] = models[i].get('valUnit');
			}

			dataToTable.push(objToPush);

			return dataToTable;
			
		}


	});

	return SensorGroupCollection;
});
 
