define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection'], function($, _, Backbone, SensorCollection) {
	var SensorGroupModel = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			type: "sensorgroup",
			size: [],
			coords: [],
			bgcolor: undefined,
			collection: undefined
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
