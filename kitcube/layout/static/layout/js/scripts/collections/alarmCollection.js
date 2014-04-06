define(['jquery', 'underscore', 'backbone', 'models/alarmModel'], function($, _, Backbone, Alarm) {
	var AlarmCollection = Backbone.Collection.extend({
		model: Alarm,
		listModel: undefined,
		initialize: function(options) {
			if (options.listModel) {
				this.listModel = options.listModel;
			}
			if (options.models) {
				this.models = options.models;
			}
		},
		serToJSON: function() {
			var jsonAlarms = [];
			var models = this.models;
			
			return jsonAlarms;
		},
		get: function(name) {
			return this[name];
		}
	});

	return AlarmCollection;
});
