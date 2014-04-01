define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var AlarmList = Backbone.Model.extend({
		defaults: {
			id: undefined,
			type: undefined,
			size: [],
			coords: [],
			cols: undefined
		},
		initialize: function(options) {
			//options || (options = {});
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
			return _.clone(this.attributes);
		}
	});

	return AlarmList;

});
