define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Chart = Backbone.Model.extend({
		defaults: {
			id: undefined,
			caption: undefined,
			type: undefined,
			link: [],
			seriesArr: [],
			legend: undefined,
			linewidth: undefined,
			size: [],
			coords: [],
			puredata: {}
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: module', function() {
				//do smth
			});
		},
		serToJSON: function() {
			return _.clone(this.attributes);
		}
	});

	return Chart;

});