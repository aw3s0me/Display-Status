define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
	var editorBoardView = Backbone.View.extend({
		container: $('#tabs'),
		grid: null,
		viewSizeDetector: null,
		curTab: null,
		settings: {

		},
		views: {
			singlesensors: {},
			charts: {},
			sensorgroups: {},
			tables: {},
			tabs: {}
		},
		initialize: function(options) {
			var initdata = "";
			if (options.initdata) {
				initdata = options.initdata;
			}
			console.log('init board view');
		},
		render: function() {

		},
		insertFromCfg: function(prsObj) {

		},
		establishStyle: function() {

		},
		detectSizes: function(blockSize, xBlocks, yBlocks, bannerId, footerId, options) {
			try {
				this.viewSizeDetector = new sizeDetector(blockSize, xBlocks, yBlocks, bannerId, footerId);
				if (options) {
					if (options.fluid) {
						this.viewSizeDetector.detectSizesForFluidCanvas();
					}
					else {
						this.viewSizeDetector.detectSizesForFixedCanvas();
					}
				}
				else {
					this.viewSizeDetector.detectSizesForFixedCanvas();
				}
				
			} catch (err) {
			 	alert(err.message);
			}
		}
	});

	return editorBoardView;
});