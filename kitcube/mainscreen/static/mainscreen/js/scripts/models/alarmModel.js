var Alarm = Backbone.Model.extend({
	defaults: {
		no: undefined,
		module: undefined,
		group: undefined,
		app: undefined,
		lastDate: undefined,
		delayedBy: undefined,
		
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