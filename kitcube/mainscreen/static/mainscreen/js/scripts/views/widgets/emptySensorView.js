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
			}
			else {
				throw "SensorView needs model";
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

			this.container.find('.close').click(function(event){
				event.stopImmediatePropagation();
				self.removeFromDom();
				//event.stopImmediatePropagation();
				//self.container.remove();
				return;
			}); 

		},
		render: function() {
			var newSensor = this.model;
			var self = this;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];
			this.container = $('<div></div>');
			this.container.attr('class', 'empty');

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 14 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			//s0.innerHTML = newSensor.get('name');
			s0.innerHTML = "";
			s0.className = "sensorName";
			s0.style.fontWeight = 'bold';

			var s1 = document.createElement('div');
			s1.style.position = 'absolute';
			var maxFont = 30 * scale;
			s1.style.bottom = 2 * scale + 'px';
			var tempDiv = $('<div></div>');
			tempDiv.attr('id', 'b'+ this.model.get('id'));
			//tempDiv.text((newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1));
			tempDiv.text("");
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

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			//s2.innerHTML = newSensor.get('unit');
			s2.className = "sensorUnit";

			/*var s3 = document.createElement('div');
			s3.style.position = 'absolute';
			s3.style.fontSize = 12 * scale + 'px';
			s3.style.right = 5 * scale + 'px';
			s3.style.top = 4 * scale + 'px';
			s3.innerHTML = "<b>x</b>";
			s3.className = "close"; */

			this.container.append(s0);
			this.container.append(s1);
			this.container.append(s2);
			//this.container.append(s3);

			this.container.css('background-color', this.model.get('bgcolor'));

			var self = this;

			if (!this.isGrouped) {

			}

			this.container.find('.close').click(function(event){
				event.stopImmediatePropagation();
				self.removeFromDom();
				return;
			});

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