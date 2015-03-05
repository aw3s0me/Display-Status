define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/widgets/sensorSingle.html', 'views/widgets/baseWidgetView'], function($, _, Backbone, SensorModel, SensorTemplate, BaseWidgetView) {
	var SensorView = BaseWidgetView.extend({
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
			if (options.group === true) {
				this.isGrouped = true;
			}

			this.render();

			this.model.on('resize', this.onresize, this);
			this.model.on('change:status', this.onchangestatus, this);
			this.model.on('change:value', this.onchangevalue, this);
			this.model.on('firstLoading', this.onfinishfirstloading, this);

			this.model.updateModel();
			this.setStatus(this.container.find('.sensor-led a'), this.model);

			this.container.bind("dragstart", _.bind(this._onDragStart, this))
		},
		_onDragStart: function (e) {
			if (e.originalEvent) e = e.originalEvent;
			e.dataTransfer.setData('text/html', this.model.get('id'));
			console.log('DRAG START');
		},
		events: {
			'error': 'onerror'
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
		},
		setStatus: function (led, model) {
			led.removeClass();
			led.addClass('sensor-led-' + model.get('status'));
		},
		onchangevalue: function(model) {
			var sensorDiv = this.container;
			var sensortype = model.get('sensortype');
			var valToInsert = model.get('valUnit');
			//var valToInsert = model.get('value');
			var name = this.model.get('name');
			var scale = this.grid.getScale();
			var valDiv = this.container.find('.sensor-val');
			$('#b' + model.get('id')).text(valToInsert);
		},
		onchangevaluelink: function(model) {
			var valToInsert = model.get('valUnit');
			$('#c' + this.model.get('id')).text(valToInsert);
		}
	});

	return SensorView;
});