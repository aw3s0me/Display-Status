define(['jquery', 'underscore', 'backbone', 'text!templates/board.html', 'models/sensorModel', 'text!templates/sensor.html'], function($, _, Backbone, boardTemplate, Sensor, sensorTemplate) {
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}



	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		maxSizeX: 0,
		maxSizeY: 0,
		nowCoordX: 0,
		nowCoordY: 0,
		grid: null,
		viewSizeDetector: null,
		tabs: [],
		render: function() {

		},
		resize: function(x, y) {

		},
		change: function(NumX, NumY) {},
		initialize: function(options) {
			this.viewSizeDetector = new sizeDetector(50, 50, '#banner', '#footer');
			console.log(this.viewSizeDetector.detectBannerSize());
			console.log(this.viewSizeDetector.detectFooterSize());
			console.log(this.viewSizeDetector.detectBoardSize());
			//console.log('options: ' + options);


			//var textToParse = options.aceText;
			var data = {};
			var compiledTemplate = _.template(boardTemplate, data);
			console.log(this.container);
			this.container.append(compiledTemplate);
			$('.canvas').attr("id", "tab1");

			//console.log(this.grid);

			var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizeMax.height) / 2;
			$('.canvas').css('margin-top', marginTop + 'px');
			$('.canvas').css('height', this.viewSizeDetector.boardSizeMax.height + 'px');
			$('.canvas').css('width', this.viewSizeDetector.boardSizeMax.width + 'px');
			$('.canvas').data('height', this.viewSizeDetector.boardSizeMax.height);
			$('.canvas').data('width', this.viewSizeDetector.boardSizeMax.width);
			$('.canvas').data('height-fullscreen', this.viewSizeDetector.boardSizeFullscreen.height);
			$('.canvas').data('width-fullscreen', this.viewSizeDetector.boardSizeFullscreen.width);

			$('.canvas').data('gridUnitX', this.viewSizeDetector.unitSize.width);
			$('.canvas').data('gridUnitY', this.viewSizeDetector.unitSize.height);
			$('.canvas').data('gridSizeX', this.viewSizeDetector.gridSize.width);
			$('.canvas').data('gridSizeY', this.viewSizeDetector.gridSize.height);
			//console.log("sizedet: " + this.viewSizeDetector.scale);
			$('.canvas').data('scale', this.viewSizeDetector.scale);

			this.grid = new kitGrid("#tab1");
			console.log(this.grid.getScale());
			this.addSensor(4, 2, this.grid.getScale());
			var self = this;
			$('#canvasButton').click(function(e) {
				self.submitTest();
			})
		},
		submitTest: function() {
			fncstring = $('#testfunction').val();
			var self = this;
			var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
			var args = /\(([^)]+)/.exec(fncstring);
			fncname = fncname[0];
			if (args !== null)
				args = args[1].split(/\s*,\s*/);

			switch (fncname) {
				case "drawText":
					args[4] = /[^'"]+/.exec(args[4]);
					var e = self.drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
					break;
				case "drawSensor":
					var e = self.addSensor(args[0], args[1], args[2], args[3]);
					break;
				case "addSensor":
					args[2] = /[^'"]+/.exec(args[2]);
					var e = self.addSensor(args[0], args[1], args[2], args[3]);
					//console.log("" + args[0] + args[1] + args[2] + args[3]);
					break;
				case "updatePage":
					//self.updatePage();
					break;
				default:
					alert('function "' + fncname + '" not defined');
			}
		},
		addSensor: function(px, py, sensorId) {
			var self = this;
			var scale = self.grid.getScale();
			var newSensor = new Sensor({
				id: "sensor1",
				name: "bright",
				comment: "doesnt work",
				unit: "km/h",
				value: 85,
				max: 100,
				min: 15,
				alarm: 4
			});
			//var compiledTemplate = _.template(sensorTemplate, { sensor: newSensor.toJSON() });
			//var jqDivTemplate = $(compiledTemplate);
			var myDiv = $('<div></div>');
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.innerHTML += '<br>' + newSensor.get('comment');

			var s1 = document.createElement('div');
			s1.id = newSensor.get('id');
			s1.style.position = 'absolute';
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			console.log(newSensor.get('value'));
			s1.innerHTML = (newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1);

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = newSensor.get('unit');
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

			this.grid.addUnit(4, 2, px, py, scale, myDiv);

			//console.log($(compiledTemplate));
		},
		updateSensor: function(sensor) {
			var data = {};
			var sensor = this;
			$.get(sensor.url, function(data) {
				var arrayOfData = data.split(',');
				var value = parseFloat(
					arrayOfData[arrayOfData.length - 1]);
				sensor.value = value;
			});
		},
		/*events: {
			'click #canvasButton': 'alert'
		}, */
		alert: function(e) {
			console.log(e);
		}



	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});