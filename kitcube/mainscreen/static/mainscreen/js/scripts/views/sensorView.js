define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/sensor.html'], function($, _, Backbone, SensorModel, SensorTemplate) {
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
			this.render();
			this.model.on('resize', this.onresize, this);
			this.model.on('changebgcolor', this.onchangebgcolor, this);
		},
		render: function() {
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

			var sensorDiv = this.container;
			
			var height = model.get('size')[0];
			var width = model.get('size')[1];

			//var ratio = height/width;
			var max = (height > width) ? height : width;
			var min = (height < width) ? height : width;
			var ratio = min/max;
			//var ratio = $(s0).height()/sensorDiv.parent().height();
			//console.log(ratio);
			//var scaleResize = this.grid.getScale() * factor;

			/*var s0 = sensorDiv.find('.sensorName')[0];
			s0.style.fontSize = ratio + 'vw';

			var s1 = sensorDiv.find('.sensorVal')[0];
			s1.style.fontSize = 2*ratio + 'vw';

			var s2 = sensorDiv.find('.sensorUnit')[0];
			s2.style.fontSize = ratio + 'vw';

			var s4 = sensorDiv.find('.sensorAlarm')[0];
			s4.style.fontSize = ratio + 'vw';

			var s3 = sensorDiv.find('.close')[0];
			s3.style.fontSize = ratio + 'vw'; */

			/*var s0 = sensorDiv.find('.sensorName')[0];
			var s1 = sensorDiv.find('.sensorVal')[0];
			var s2 = sensorDiv.find('.sensorUnit')[0];
			var s4 = sensorDiv.find('.sensorAlarm')[0];
			s0.style.fontSize = '100%';
			s1.style.fontSize = '100%';
			s2.style.fontSize = '100%';
			s4.style.fontSize = '100%'; */
		},
		onchangebgcolor: function(model) {
			var sensorDiv = this.container;
			var sensorModel = model;

			var tile = sensorDiv.parent();

			tile.css('background-color', this.model.get('bgcolor'));

		}
	});

	return SensorView;
});