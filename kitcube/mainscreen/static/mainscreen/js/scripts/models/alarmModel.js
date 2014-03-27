define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Alarm = Backbone.Model.extend({
		defaults: {
			id: undefined,
			no: undefined,
			module: undefined,
			group: undefined,
			app: undefined,
			server: undefined,
			dbname: undefined,
			mask: undefined,
			lastDate: undefined,
			delayedBy: undefined,
			severity: undefined
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: module', function() {
				//do smth
			});
		},
		getProperties: function() {
			return {
				no: this.get('no'),
				module: this.get('module'),
				group: this.get('group'),
				app: this.get('app'),
				lastDate: this.get('lastDate'),
				delayedBy: this.get('delayedBy')
			};
		}

	});

	return Alarm;

});