define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var SensorGroupModel = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			type: "sensorgroup",
			size: [],
			coords: [],
			bgcolor: undefined
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: value', function() {
				//do smth
			});
		},
		serToJSON: function() {
			var sensorClone = this.clone();

			return _.clone(sensorClone.attributes);
		}
	});

	return SensorGroupModel;

}); 
