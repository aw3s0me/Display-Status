define(['jquery', 'underscore', 'backbone', 'models/sensorModel', 'text!templates/sensor.html'], function($, _, Backbone, SensorModel, SensorTemplate) {
	var SensorView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			this.render();
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
			//console.log(newSensor);
			//var compiledTemplate = _.template(sensorTemplate, { sensor: newSensor.toJSON() });
			//var jqDivTemplate = $(compiledTemplate);
			var myDiv = $('<div></div>');
			myDiv.attr('id', newSensor.get('id'));
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
			myDiv.append(s0);
			myDiv.append(s1);
			myDiv.append(s2);
			myDiv.append(s3);
			myDiv.append(s4);

			this.grid.addUnit(dx, dy, px, py, scale, myDiv);
		}

	});

	return SensorView;
});