define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Chart = Backbone.Model.extend({
		defaults: {
			id: undefined,
			caption: undefined,
			type: "chart",
			link: [],
			sensorModels: [],
			seriesArr: [],
			legend: undefined,
			linewidth: undefined,
			size: [],
			coords: [],
			puredata: {}
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: module', function() {
				//do smth
			});
			
		},
		serToJSON: function() {
			var chartClone = this.clone();
			chartClone.unset('id', {silent: true});
			chartClone.unset('seriesArr', {silent: true});
			chartClone.unset('puredata', {silent: true});
			chartClone.unset('sensorModels', {silent: true});

			return _.clone(chartClone.attributes);
		}
	});

	return Chart;

});