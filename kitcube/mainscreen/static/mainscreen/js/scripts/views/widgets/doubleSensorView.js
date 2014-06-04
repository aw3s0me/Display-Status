define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/widgets/sensorDouble.html'], function($, _, Backbone, SensorModel, SensorTemplate) {
	var SensorView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		linkModel: undefined,
		isGrouped: false,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			var self = this;
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			} else {
				throw "SensorView needs model";
			}
			if (options.linkModel) {
				this.linkModel = options.linkModel;
				this.linkModel.on('change:bgcolor', this.onchangebgcolor, this);
				this.linkModel.on('change:value', this.onchangevaluelink, this);
				this.linkModel.on('removedFromChart', this.onremovedfromchart, this);
			}
			if (options.group === true) {
				this.isGrouped = true;
			}

			this.render();

			this.model.on('resize', this.onresize, this);
			this.model.on('change:bgcolor', this.onchangebgcolor, this);
			this.model.on('change:value', this.onchangevalue, this);
			this.model.on('removedFromChart', this.onremovedfromchart, this);

			this.model.updateModel();
			this.container.mousedown(function(event) {
				if (event.ctrlKey) {
					if (!self.container.hasClass('activeSensor1') && !self.container.hasClass('chartAdded1')) {
						self.container.addClass('activeSensor1');
						return;
					}
					if (self.container.hasClass('activeSensor1')) {
						self.container.removeClass('activeSensor1');
					}
					if (self.container.hasClass('chartAdded1')) {
						//self.container.find('.chartCircle').css('background-color', 'grey');
						self.container.removeClass('chartAdded1');
						self.model.trigger('deleteSensor', self.model);
					}
				} else if (event.shiftKey) {
					if (!self.container.hasClass('activeSensor2') && !self.container.hasClass('chartAdded2')) {
						self.container.addClass('activeSensor2');
						return;
					}
					if (self.container.hasClass('activeSensor2')) {
						self.container.removeClass('activeSensor2');
					}
					if (self.container.hasClass('chartAdded2')) {
						//self.container.find('.chartCircle').css('background-color', 'grey');
						self.container.removeClass('chartAdded2');
						self.linkModel.trigger('deleteSensor', self.linkModel);
					}
				}

			});

			this.container.find('.close').click(function(event) {
				event.stopImmediatePropagation();
				self.removeFromDom();
				return;
			});

		},
		render: function() {
			var newSensor = this.model;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];
			var prevHeight = 2 * this.grid.getUnitSizes().height * this.grid.getScale() * 0.34;

			var dblSensorTemplate = $(_.template(SensorTemplate, {
				sensor_main_id: newSensor.get('id'),
				sensor_sub_id: this.linkModel.get('id'),
				main_val: (newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1),
				name: newSensor.get('name'),
				sub_val: (this.linkModel.get('value') === undefined) ? 'NAN' : (this.linkModel.get('value')).toFixed(1),
				unit1: newSensor.get('unit'),
				unit2: this.linkModel.get('unit')
			}));

			this.container = $(dblSensorTemplate).css('background-color', newSensor.get('bgcolor'));

			this.container.find('.sensorName').css('font-size', 14 * scale + 'px')
			.css('left', 5 * scale + 'px')
			.css('line-height', 15 * scale + 'px')

			var main_val = this.container.find('#val_' + newSensor.get('id')); //nested div because of big text
			var main_val_child = main_val.children('#b' + newSensor.get('id'));
			var sub_val = this.container.find('#val_' + this.linkModel.get('id'));
			var sub_val_child = sub_val.children('#c' + newSensor.get('id'))

			main_val_child
				.css('width', main_val.width())
				.css('height', main_val.height());
	
			main_val.css('bottom', 2 * scale + 'px')
				.css('padding-right', 6 * scale + 'px')
				.bigtext({
					maxfontsize: 30 * scale
				});
			sub_val_child
				.css('width', main_val.width())
				.css('height', main_val.height())
				.css('color', 'white');

			sub_val.css('bottom', prevHeight + 'px')
			.css('padding-right', 6 * scale + 'px')
			.bigtext({
					maxfontsize: 30 * scale
				});

			this.container.find('.sensorUnit')
				.css('font-size', 12 * scale + 'px')
				.css('right', 5 * scale + 'px')
				.css('top', 20 * scale + 'px');

			this.container.find('.close').css('font-size', 12 * scale + 'px')
				.css('right', 5 * scale + 'px')
				.css('top', 4 * scale + 'px');

		},
		getHtml: function() {
			return this.container[0];
		},
		getContainer: function() {
			return this.container;
		},
		removeFromDom: function() {
			this.trigger('removing', this.model);
			this.container.remove();
			this.model.trigger('removing', this.model);
			this.linkModel.trigger('removing', this.linkModel);
			this.remove();
			this.unbind();
		},
		onresize: function(model) {
			var sensorDiv = this.container;
			var height = model.get('size')[0];
			var width = model.get('size')[1];

			var max = (height > width) ? height : width;
			var min = (height < width) ? height : width;
			var ratio = min / max;
		},
		onchangebgcolor: function(model) {
			var sensorDiv = this.container;
			var sensorModel = model;

			sensorDiv.css('background-color', this.model.get('bgcolor'));
		},
		onchangevalue: function(model) {
			var sensorDiv = this.container;
			var sensortype = model.get('sensortype');
			var valToInsert = model.get('valUnit');
			var name = this.model.get('name');
			var scale = this.grid.getScale();
			var maxFont = 30 * scale;
			var minFont = 25 * scale + 'px';
			var valDiv = this.container.find('.sensorVal');
			$('#b' + model.get('id')).text(valToInsert);
		},
		onchangevaluelink: function(model) {
			var valToInsert = model.get('valUnit');
			$('#c' + this.model.get('id')).text(valToInsert);
		},
		onremovedfromchart: function() {
			//this.container.find('.chartCircle').css('background-color', 'grey');
			this.container.removeClass('chartAdded1');
			this.container.removeClass('chartAdded2');
			this.container.removeClass('chartAdded');
		}
	});

	return SensorView;
});