define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var TrendSensorView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			else {
				throw "SensorView needs model";
			}
			if (options.group === true) {
				this.isGrouped = true;
				this.renderGrouped();
			}
			else {
				this.renderSingle();
			}
			
			this.model.on('resize', this.onresize, this);
			this.model.on('change:bgcolor', this.onchangebgcolor, this);
			this.model.on('change:value', this.onchangevalue, this);
		},
		renderSingle: function() {
			//load html template
			var newSensor = this.model;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));
			
			this.grid.addUnit(dx, dy, px, py, scale, this.container, {}, this.model);
			
		},
		renderGrouped: function() {
			var newSensor = this.model;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));


			this.container.css('background-color', this.model.get('bgcolor'));
		},
		getHtml: function() {
			return this.container[0];
		},
		getContainer: function() {
			return this.container;
		},
		rerender: function() {
			var sensorDiv = this.container;
			var scale = this.grid.getScale();
			var sensorModel = this.model;

			var tile = sensorDiv.parent();

			this.grid.resizeTile(sensorModel.get('coords')[0], sensorModel.get('coords')[1], sensorModel.get('size')[0], sensorModel.get('size')[1], tile);

		},
		removeFromDom: function() {
			//this.container.remove();
			this.grid.removeUnit(this.container.parent());
		},
		onresize: function(model) {

		},
		onchangebgcolor: function(model) {
			var sensorDiv = this.container;
			var sensorModel = model;

			sensorDiv.css('background-color', this.model.get('bgcolor'));
		},
		onchangevalue: function(model) {
			var sensorDiv = this.container;
			var sensortype = model.get('sensortype');

		}
	});

	return TrendSensorView;
});