define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Sensor = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			comment: undefined,
			unit: undefined,
			value: undefined,
			max: undefined,
			min: undefined,
			alarm: undefined,
			url: undefined
		},
		initialize: function() {
			console.log("model created");
			this.on('change: module', function() {
				//do smth
			});
		},
		getProperties: function() {
			return {

			}
		}

	});

	return Sensor;

});