define(['jquery', 'underscore', 'backbone', 'text!templates/board.html'], function($, _, Backbone, boardViewTemplate) {
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}
	var BoardView = Backbone.View.extend({
		container: $('#kitcube-container'),
		maxSizeX: 0,
		maxSizeY: 0,
		nowCoordX: 0,
		nowCoordY: 0,
		grid: null,
		viewSizeDetector: null,
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
			//this.grid = 

			//var textToParse = options.aceText;
			var data = {};
			var compiledTemplate = _.template(boardViewTemplate, data);
			console.log(this.container);
			this.container.append(compiledTemplate);

			var marginTop = ($(window).height() - $('#banner').css('height').toNum() - $('#footer').css('height').toNum() - this.viewSizeDetector.boardSizeMax.height) / 2;

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
		}
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});