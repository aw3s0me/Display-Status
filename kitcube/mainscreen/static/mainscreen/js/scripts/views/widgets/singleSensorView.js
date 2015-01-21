define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/widgets/sensorSingle.html'], function($, _, Backbone, SensorModel, SensorTemplate) {
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
				this.linkModel.on('change:value', this.onchangevaluelink, this);
			}
			if (options.group === true) {
				this.isGrouped = true;
			}

			this.render();

			this.model.on('resize', this.onresize, this);
			this.model.on('change:status', this.onchangestatus, this);
			this.model.on('change:value', this.onchangevalue, this);
			this.model.on('removedFromChart', this.onremovedfromchart, this);
			this.model.on('firstLoading', this.onfinishfirstloading, this);

			this.model.updateModel();
			this.setStatus(this.container.find('.sensor-led a'), this.model);
			//this.container.mousedown(function(event) {
			this.container.dblclick(function(event) {
				//if (event.ctrlKey || event.shiftKey) {
					if(document.selection && document.selection.empty) {
				        document.selection.empty();
				    } else if(window.getSelection) {
				        var sel = window.getSelection();
				        sel.removeAllRanges();
				    }

					if (!self.container.hasClass('activeSensor') && !self.container.hasClass('chartAdded')) {
						self.container.addClass('activeSensor');
						return;
					}
					if (self.container.hasClass('activeSensor')) {
						self.container.removeClass('activeSensor');
					}
					if (self.container.hasClass('chartAdded')) {
						//self.container.find('.chartCircle').css('background-color', 'grey');
						self.container.removeClass('chartAdded');
						self.model.trigger('deleteSensor', self.model);
					}
				//}
			});

		},
		events: {
			'click': 'onclick',
			'error': 'onerror'
		},
		onclick: function(event) {
			console.log('clicked');
		},
		onerror: function (event) {
			this.container.find('.sensor-loading').hide();
			this.container.find('.sensor-error').show();
		},
		onfinishfirstloading: function(event) {
			this.container.find('.sensor-loading').hide();
		},
		render: function() {
			var newSensor = this.model;
			//console.log(this.model);
			var sizeCoeff = this.model.get('size')[0] / 2;
			var scale = sizeCoeff * this.grid.getScale();


			var snglSensorTemplate = $(_.template(SensorTemplate, {
				sensor_id: newSensor.get('id'),
				val: (newSensor.get('value') === undefined) ? '' : (newSensor.get('value')).toFixed(1),
				name: newSensor.get('name'),
				unit: newSensor.get('unit'),
				canberemoved: newSensor.get('canberemoved')
			}));

			this.container = $(snglSensorTemplate).css('background-color', newSensor.get('bgcolor'));

			//this.container.find('.sensorName').css('font-size', 14 * scale + 'px')

			//this.container.find('.sensorUnit')
				//.css('font-size', 12 * scale + 'px');

			if (newSensor.get('canberemoved')) {
				this.container.find('.close').css('font-size', 12 * scale + 'px')
				.css('right', 5 * scale + 'px')
				.css('top', 4 * scale + 'px')
				.click(function(event) {
					event.stopImmediatePropagation();
					self.removeFromDom();
					return;
				});
			}

			this.setIfOkAfterLoading(newSensor.get('value'));
		},
		setIfOkAfterLoading: function (value) {
			if (value !== undefined) {
				this.container.find('.sensor-loading').hide();
			}
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
			//this.linkModel.trigger('removing', this.linkModel);
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
		onchangestatus: function(model) {
			var sensorDiv = this.container;
			var led = sensorDiv.find('.sensor-led a');
			this.setStatus(led, model);
			//sensorDiv.find('#val_' + this.model.get('id')).css('color', this.model.get('valcolor'));
			//sensorDiv.css('background-color', this.model.get('valcolor'));
		},
		setStatus: function (led, model) {
			led.removeClass();
			led.addClass('sensor-led-' + model.get('status'));
		},
		onchangevalue: function(model) {
			var sensorDiv = this.container;
			var sensortype = model.get('sensortype');
			var valToInsert = model.get('valUnit');
			var name = this.model.get('name');
			var scale = this.grid.getScale();
			var valDiv = this.container.find('.sensor-val');
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