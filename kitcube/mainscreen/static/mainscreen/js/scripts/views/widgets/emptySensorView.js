define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/widgets/sensorEmpty.html'], function($, _, Backbone, SensorModel, SensorTemplate) {
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
			}
			else {
				throw "SensorView needs model";
			}
			if (options.group === true) {
				this.isGrouped = true;
			}

			this.render();
		},
		render: function() {
			var newSensor = this.model;
			var self = this;
			this.container = $(_.template(SensorTemplate, {
				sensor_id: newSensor.get('id'),
				canberemoved: false
			}));

			//this.container.find('.close').click(function(event){
			//	event.stopImmediatePropagation();
			//	self.removeFromDom();
			//	return;
			//});
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
			if (this.linkModel !== undefined) {
				this.linkModel.trigger('removing', this.linkModel);
			}
			this.remove();
			this.unbind();
		},
		onresize: function(model) {
			var sensorDiv = this.container;
			
			var height = model.get('size')[0];
			var width = model.get('size')[1];
		},
		onchangebgcolor: function(model) {
			var sensorDiv = this.container;
			var sensorModel = model;

			sensorDiv.css('background-color', this.model.get('bgcolor'));
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