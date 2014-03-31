define(['jquery', 'underscore', 'backbone', 'models/alarmModel'], function($, _, Backbone, Alarm) {
	var AlarmCollection = Backbone.Collection.extend({
		model: Alarm,
		initialize: function(models) {
			
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
