define(['jquery', 'underscore', 'backbone', 'models/alarmModel'], function($, _, Backbone, Alarm) {
	var AlarmCollection = Backbone.Collection.extend({
		id: undefined,
		type: undefined,
		size: [],
		coords: [],
		cols: undefined,
		model: Alarm,
		initialize: function(models, options) {
			options || (options = {});
			if (options.id) {
				this.id = options.id;
			}
			if (options.type) {
				this.type = options.type;
			}
			if (options.size) {
				this.size = options.size;
			}
			if (options.coords) {
				this.coords = options.coords;
			}
			if (options.cols) {
				this.cols = options.cols;
			}
		},
		serToJSON: function() {
			var jsonAlarms = {

			};
			var models = this.models;
			for (var i = 0; i < this.models.length; i++) {
				var model = this.models[i];
				jsonAlarms[model.get('id')] = model.serToJSON();
			}
			return jsonAlarms;
		},
		get: function(name) {
			return this[name];
		}
	});

	return AlarmCollection;
});
