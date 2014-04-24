define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/sensor.html', 'slabtext'], function($, _, Backbone, SensorModel, SensorTemplate, slabText) {
	var SensorView = Backbone.View.extend({
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
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.innerHTML += '<br>' + newSensor.get('comment');
			s0.className = "sensorName";

			var s1 = document.createElement('div');
			//s1.id = newSensor.get('id');
			s1.style.position = 'absolute';
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			s1.innerHTML = (newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1);
			s1.className = "sensorVal";

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = newSensor.get('unit');
			s2.className = "sensorUnit";

			var s4 = document.createElement('div');
			s4.style.position = 'absolute';
			s4.style.fontSize = 10 * scale + 'px';
			s4.style.left = 5 * scale + 'px';
			s4.style.bottom = 2 * scale + 'px';
			s4.innerHTML = "min:" + newSensor.get('min') + "<br>max:" + newSensor.get('max') + "<br>alert:" + newSensor.get('alert');
			s4.className = "sensorAlarm";

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
			this.container.append(s4);

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
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 14 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.className = "sensorName";
			s0.style.fontWeight = 'bold';

			var s1 = document.createElement('div');
			s1.style.position = 'absolute';
			var maxFont = 30 * scale;
			s1.style.bottom = 2 * scale + 'px';
			var tempDiv = $('<div></div>');
			tempDiv.attr('id', 'b'+ this.model.get('id'));
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

			if (newSensor.get('link')) {
				//var prevHeight = this.container.height() * 0.4;
				var prevHeight = 2 * this.grid.getUnitSizes().height * this.grid.getScale() * 0.34;

				var s5 = document.createElement('div');
				s5.style.position = 'absolute';
				var maxFont = 30 * scale;
				s5.style.bottom = prevHeight + 'px';
				console.log(prevHeight);
				var tempDiv = $('<div></div>');
				tempDiv.attr('id', 'c'+ this.model.get('id'));
				tempDiv.text((this.linkModel.get('value') === undefined) ? 'NAN' : (this.linkModel.get('value')).toFixed(1));
				$(s5).append(tempDiv);
				s5.className = "sensorVal";
				s5.className += " slab";
				s5.className += " bigtext";
				s5.style.paddingRight = 6 * scale + 'px';
				tempDiv.css('width', $(s5).width());
				tempDiv.css('height', $(s5).height());
				$(s5).bigtext({
					maxfontsize: maxFont
				});
				this.container.append(s5);
				s2.innerHTML = this.linkModel.get('unit') + "/" + s2.innerHTML;
			}

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

			var s0 = sensorDiv.find('.sensorName')[0];
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = sensorModel.get('name');
			s0.innerHTML += '<br>' + sensorModel.get('comment');

			var s1 = sensorDiv.find('.sensorVal')[0];
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			s1.innerHTML = (sensorModel.get('value') === undefined) ? 'NAN' : (sensorModel.get('value')).toFixed(1);

			var s2 = sensorDiv.find('.sensorUnit')[0];
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = sensorModel.get('unit');

			var s4 = sensorDiv.find('.sensorAlarm')[0];
			s4.style.fontSize = 10 * scale + 'px';
			s4.style.left = 5 * scale + 'px';
			s4.style.bottom = 2 * scale + 'px';
			s4.innerHTML = "min:" + sensorModel.get('min') + "<br>max:" + sensorModel.get('max') + "<br>alert:" + sensorModel.get('alert');

			var s3 = sensorDiv.find('.close')[0];
			s3.style.position = 'absolute';
			s3.style.fontSize = 12 * scale + 'px';
			s3.style.right = 5 * scale + 'px';
			s3.style.top = 4 * scale + 'px';
			s3.innerHTML = "<b>x</b>";
			//console.log('updated');
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
			var valToInsert = model.get('valUnit');
			var name = this.model.get('name');

			var scale = this.grid.getScale();
			var maxFont = 30 * scale;
			var minFont = 25 * scale + 'px';
			var valDiv = this.container.find('.sensorVal');

			$('#b' + model.get('id')).text(valToInsert);
			/*valDiv.bigtext({
				maxfontsize: maxFont
			});*/
		},
		onchangevaluelink: function(model) {
			var valToInsert = model.get('valUnit');
			$('#c' + this.model.get('id')).text(valToInsert);
		}
	});

	return SensorView;
});