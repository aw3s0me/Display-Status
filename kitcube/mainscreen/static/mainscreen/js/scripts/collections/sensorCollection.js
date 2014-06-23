define(['jquery', 'underscore', 'backbone', 'models/sensorModel'], function($, _, Backbone, Sensor) {
	var SensorGroupCollection = Backbone.Collection.extend({
		id: undefined,
		model: Sensor,
		group: " ",
		rowIndex: undefined,
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
		getDataToTable: function(isheader) {
			var models = this.models;
			//var dataToTable = [];
			var objToPush = {};

			if (isheader) {
				objToPush['column_0'] = this.group; 
				for (var i = 0; i < models.length; i++) {
					objToPush['column_' + String(i+1)] = models[i].get('valUnit');
				}
			}
			else {
				for (var i = 0; i < models.length; i++) {
					objToPush['column_' + String(i)] = models[i].get('valUnit');
				}
			}

			return objToPush;			
		},
		getLookupTable: function(isheader) {
			var obj = {};
			var models = this.models;
			var startColIndex = 0;

			if (isheader) {
				startColIndex = 1;
			}

			for (var i = 0; i < models.length; i++) {
				obj[models[i].get('id')] = {
					id: models[i].get('id'),
					col: startColIndex++,
					row: this.rowIndex
				};
			}
			return obj;
		},
		removeModel: function(model) {
			var models = this.models;
			var link = model.get('link');
			//this.remove(model);
			for (var i = 0; i < models.length; i++) {
				if (model === models[i]) {
					models.splice(i, 1);
					break;
				}
			}

			if (link !== undefined) {
				for (var i = 0; i < models.length; i++) {
					if (link === models[i].id) {
						models.splice(i, 1);
						break;
					}
				}
			}
			
			model.trigger('destroy', model);
		}


	});

	return SensorGroupCollection;
});
 
