define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel'], function($, _, Backbone, SensorGroupModel) {
	var SensorGroupView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options}) 
			if (options.grid) {
				this.grid = options.grid;
			}

			if (options.model) {
				this.model = options.model;
			}

			this.render();
			this.model.on('resize', this.onresize, this);
			this.model.on('changebgcolor', this.onchangebgcolor, this);
		},
		render: function() {
			var scale = this.grid.getScale();
			var newSensorGroup = this.model;
			var dx = newSensorGroup.get("size")[0];
			var dy = newSensorGroup.get("size")[1];
			var px = newSensorGroup.get("coords")[0];
			var py = newSensorGroup.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensorGroup.get('id'));
			
			this.container[0].style.position = 'absolute';
			this.container[0].style.fontSize = 1.8*scale +'em';
    		this.container[0].style.left = 5*scale + 'px';
    		this.container[0].innerHTML = newSensorGroup.get("name");

    		this.grid.addUnit(dx, dy, px, py, scale, this.container, {}, this.model).addClass('group');
		},
		rerender: function() {

		},
		removeFromDom: function() {

		},
		addSensor: function() {
			var sensContainer = $("<li class='ui-state-default'></li>");

		},
		onresize: function(model) {

		},
		onchangebgcolor: function(model) {

		}
	});
	return SensorGroupView;
});