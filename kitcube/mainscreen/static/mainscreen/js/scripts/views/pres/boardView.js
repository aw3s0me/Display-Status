define(['jquery', 'underscore', 'backbone', 'jqueryui', 'text!templates/pres/board.html', 'controllers/tabController', 'controllers/widgetController', 'controllers/datasourceController'], function($, _, Backbone, ui, boardTemplate, TabController, WidgetController, DatasourceController) {

	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		grid: null,
		settings: {
			size: [50, 21],
			blocksize: 50,
			sizecoeff: 2,
			isportrait: false
		},
		widgetController: WidgetController,
		tabController: TabController,
		datasourceController: DatasourceController,
		viewSizeDetector: null,
		initialize: function(options) {
			var self = this; //for refering to this in jquery
			var textToParse = options.aceText;
			this.settings.isportrait = (options.type === "portrait");
			prsObj = textToParse;

			if (prsObj['screen']['nofooter']) {
				$('#banner').css('height', '0');
			}

			if (prsObj['screen']['nobanner']) {
				$('#footer').css('height', '0');
			}

			if (prsObj['screen']) {
				this.settings.blocksize = prsObj['screen']['blocksize'] || this.settings.blocksize;
				this.settings.size[0] = prsObj['screen']['boardsize'][0] || this.settings.size[0];
				this.settings.size[1] = prsObj['screen']['boardsize'][1] || this.settings.size[1];
				this.settings['sizecoeff'] = prsObj['screen']['sizecoeff'] || this.settings.sizecoeff;
			}

			this.detectSizes(this.settings.blocksize, this.settings.size[0], this.settings.size[1], '#banner', '#footer', prsObj['screen']);

			var data = {};
			var compiledTemplate = _.template(boardTemplate, data);
			this.container.append(compiledTemplate);
			/* board insertion part */
			this.insertFromCfg(prsObj);
		},
		detectSizes: function(blockSize, xBlocks, yBlocks, bannerId, footerId, options) {
			try {
				this.viewSizeDetector = new sizeDetector(blockSize, xBlocks, yBlocks, bannerId, footerId, {
					//there goes options
				});
				if (options) {
					if (options.fluid) {
						this.viewSizeDetector.detectSizesForFluidCanvas();
					} else {
						this.viewSizeDetector.detectSizesForFixedCanvas();
					}
				} else {
					this.viewSizeDetector.detectSizesForFixedCanvas();
				}

			} catch (err) {
				throw new Error('Error in size detection');
			}
		},
		establishStyle: function(canvas, options) {
			console.log();
			canvas.css('height', this.viewSizeDetector.boardSizePx.height + 'px')
				.css('width', this.viewSizeDetector.boardSizePx.width + 'px')
				.data('height', this.viewSizeDetector.boardSizePx.height)
				.data('width', this.viewSizeDetector.boardSizePx.width)
				.data('gridUnitX', this.viewSizeDetector.unitSize)
				.data('gridUnitY', this.viewSizeDetector.unitSize)
				.data('gridSizeX', this.viewSizeDetector.gridSize.width)
				.data('gridSizeY', this.viewSizeDetector.gridSize.height)
				.data('scale', this.viewSizeDetector.scale)
				.data('scaledUnitSize', this.viewSizeDetector.scaledUnitSize);
			if (!options || !options.portrait) {
				//canvas.css('top', this.viewSizeDetector.marginTop + 'px');
				if ($('#tabs').width() < $('#wrapper').width()) {
					$('#wrapper').css('overflow-x', 'hidden');
					$('#footer').css('position', 'absolute');
					$('#footer').css('bottom', '0');
				}
			}
			else if (options && options.portrait) {
				//$('#tabs').css('top', this.viewSizeDetector.marginTop + 'px !important');
				//$('#wrapper').css('overflow-y', 'scroll');
				if ($('#tabs').width() < $('#wrapper').width()) {
					$('#wrapper').css('overflow-x', 'hidden');
					$('#footer').css('bottom', '0');
				}

				$('#tabs').css('width', this.viewSizeDetector.boardSizePx.width + 8 + 'px');
				console.log($('#wrapper').width())
				if ($('#tabs').height() < $('#wrapper').height() - 60) { //50 size of banner
					$('#wrapper').css('overflow-y', 'scroll');
				}
				$('#footer').css('position', 'absolute');
			}
		},
		insertFromCfg: function(prsObj) {
			var self = this;

			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch (_id) {
					case "datasource":
						{
							this.datasourceController.initDatasources(attr);
							break;
						}
					case "tabs":
						{
							this.tabController.initializeTabs(attr, this.viewSizeDetector, this.settings.isportrait);
							break;
						}
					case "elements":
						{
							this.el = $("#tabs")

							if (!TabController.isInitialized) {
								this.establishStyle(this.el);
								this.grid = new kitGrid(this.el);
								//this.el.removeClass('canvas').addClass('tab');
								$('#toggleGridButton').click(function(e) {
									self.grid.toggleGrid();
								});
							}

							WidgetController.initializeBoard(this, attr);
						}
				}
			}

			this.widgetController.enableFetchingData();
			this.widgetController.updateAllSensors();
		},
		clear: function() {
			this.$el.empty(); //clear board
		},
		hide: function() {
			this.el.hide();
		}
	});

	// 'jquery ', 'underscore ', 'backbone ' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});