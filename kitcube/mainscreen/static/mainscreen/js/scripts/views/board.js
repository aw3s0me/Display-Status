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
				chuanGrid: null,
				viewSizeDetector: null,
				render: function() {

				},
				resize: function(x, y) {

				},
				change: function(NumX, NumY) {},
				initialize: function(options) {
					//console.log('options: ' + options);
					//this.chuanGrid = //init grid

					var textToParse = options.aceText;
					var data = {};
					var compiledTemplate = _.template(boardViewTemplate, data);
					$("#btnAddSensor").removeClass('active');
				}
			}
		});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});