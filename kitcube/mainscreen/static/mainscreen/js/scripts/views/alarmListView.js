define(['jquery', 'underscore', 'backbone', 'models/alarmModel', 'collections/alarmCollection'], function($, _, Backbone, AlarmModel, alarmCollection) {
	var ChartView = Backbone.View.extend({
		container: undefined,
		model: undefined,
		grid: undefined,
		initialize: function(options) { //pass it as new SensorView({collection: collection, options: options})
			this.model.on("change", this.render);
		},
		render: function() {
			//load html template

		}

	});

	return ChartView;
});
  
