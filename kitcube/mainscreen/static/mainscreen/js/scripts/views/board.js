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
			this.grid = new kitGrid("#tab1");
			console.log(this.grid.getScale());
			this.addSensor(4, 2, this.grid.getScale());
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
			$('.canvas').data('scale', this.viewSizeDetector.scale);
		},
		addSensor: function(px, py, scale) {
			
			var newSensor = new Sensor({
				name: "bright", 
				comment: "doesnt work",
				unit: "km/h",
				value: "85",
				max: "100",
				min: "15",
				alarm: "4"});
			var compiledTemplate = _.template(sensorTemplate, { sensor: newSensor.toJSON() });
			var jqDivTemplate = $(compiledTemplate);
			var sensMain = jqDivTemplate.find(".sensMain")[0];
                sensMain.style.position = 'absolute';
                sensMain.style.fontSize = 13*scale + 'px';
                sensMain.style.left = 5*scale + 'px';
            var sensVal = jqDivTemplate.find(".sensVal")[0]; 
                //sensVal.id = this.id;
                sensVal.style.position = 'absolute';
                sensVal.style.fontSize = 50*scale + 'px';
                sensVal.style.right = 6*scale + 'px';
                sensVal.style.bottom = 0*scale + 'px';
            var sensUnit = jqDivTemplate.find(".sensUnit")[0];
                sensUnit.style.position = 'absolute';
                sensUnit.style.fontSize = 12*scale + 'px';
                sensUnit.style.right = 5*scale + 'px';
                sensUnit.style.top = 20*scale + 'px';
                sensUnit.innerHTML = this.unit;
            var sensClose = jqDivTemplate.find('.sensClose')[0];
                sensClose.style.position = 'absolute';
                sensClose.style.fontSize = 12*scale + 'px';
                sensClose.style.right = 5*scale + 'px';
                sensClose.style.top = 4*scale + 'px';

			this.grid.addUnit(4, 2, px, py, scale, compiledTemplate);

			console.log($(compiledTemplate));
		}


	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});