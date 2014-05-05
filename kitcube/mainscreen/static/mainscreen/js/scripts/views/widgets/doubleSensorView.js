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

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 14 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.className = "sensorName";
			s0.style.fontWeight = 'bold';
			s0.style.lineHeight = 15 * scale + 'px';

			var s1 = document.createElement('div');
			s1.style.position = 'absolute';
			var maxFont = 30 * scale;
			s1.style.bottom = 2 * scale + 'px';
			var tempDiv = $('<div></div>');
			tempDiv.attr('id', 'b' + this.model.get('id'));
			tempDiv.text((newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1));
			$(s1).append(tempDiv);
			s1.className = "sensorVal";
			//s1.className += " slabtext";
			s1.className += " slab";
			s1.className += " bigtext";
			s1.style.paddingRight = 6 * scale + 'px';
			//$(s1).fitText(1.2, { minFontSize: minFont, maxFontSize: maxFont });
			//$(".slab").slabText();
			tempDiv.css('width', $(s1).width());
			tempDiv.css('height', $(s1).height());
			//$(s1).bigtext();
			$(s1).bigtext({
				maxfontsize: maxFont
			});

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = newSensor.get('unit');
			s2.className = "sensorUnit";

			//var prevHeight = this.container.height() * 0.4;
			var prevHeight = 2 * this.grid.getUnitSizes().height * this.grid.getScale() * 0.34;

			var s5 = document.createElement('div');
			s5.style.position = 'absolute';
			var maxFont = 30 * scale;
			s5.style.bottom = prevHeight + 'px';
			console.log(prevHeight);
			var tempDiv = $('<div></div>');
			tempDiv.attr('id', 'c' + this.model.get('id'));
			tempDiv.text((this.linkModel.get('value') === undefined) ? 'NAN' : (this.linkModel.get('value')).toFixed(1));
			$(s5).append(tempDiv);
			s5.className = "sensorVal";
			s5.className += " slab";
			s5.className += " bigtext";
			s5.style.paddingRight = 6 * scale + 'px';
			$(s5).css('color', 'white');
			tempDiv.css('width', $(s5).width());
			tempDiv.css('height', $(s5).height());
			$(s5).bigtext({
				maxfontsize: maxFont
			});
			this.container.append(s5);
			s2.innerHTML = "<span class='sensUnit2'>" + this.linkModel.get('unit') + "</span>" + "/" + s2.innerHTML;
			this.container.attr('id2', this.linkModel.get('id'));

			var s3 = document.createElement('div');
			s3.style.position = 'absolute';
			s3.style.fontSize = 12 * scale + 'px';
			s3.style.right = 5 * scale + 'px';
			s3.style.top = 4 * scale + 'px';
			s3.innerHTML = "<b>x</b>";
			s3.className = "close";

			this.container.append(s0);
			this.container.append(s1);
			this.container.append(s2);
			this.container.append(s3);
			this.container.append(s5);

			this.container.css('background-color', this.model.get('bgcolor'));

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