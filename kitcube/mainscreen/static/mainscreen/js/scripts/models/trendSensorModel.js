define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var TrendSensorModel = Backbone.Model.extend({
		defaults: {
			id: undefined,
			model: undefined,
			range: undefined,
			name: "",
			size: [6, 4],
			coords: [0, 0]
		},
		initialize: function() {

		},
		getChartProperties: function() {

		},
		getDbUrl: function() {

		},
		serToJSON: function() {

		}
	});

	return TrendSensorModel;

});