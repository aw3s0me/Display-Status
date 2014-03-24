define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Sensor = Backbone.Model.extend({
		defaults: {
			name: undefined,
			comment: undefined,
			unit: undefined,
			value: undefined,
			max: undefined,
			min: undefined,
			alarm: undefined
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