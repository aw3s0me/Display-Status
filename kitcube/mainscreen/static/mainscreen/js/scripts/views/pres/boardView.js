define(['jquery', 'underscore', 'backbone', 'jqueryui', 'kitgrid', "kit.sizeDetector", 'text!templates/pres/board.html', 'controllers/tabController', 'controllers/widgetController', 'controllers/datasourceController'], function($, _, Backbone, ui, kitgrid, sizeDet, boardTemplate, TabController, WidgetController, DatasourceController) {

	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		grid: null,
		settings: {
			size: [50, 21],
			blocksize: 50,
			sizecoeff: 2,
			isportrait: false,
			issimulation: false
		},
		widgetController: WidgetController,
		tabController: TabController,
		datasourceController: DatasourceController,
		viewSizeDetector: null,
		getCfgType: function() {
			return window.innerHeight > window.innerWidth ? cfgType = 'portrait' : cfgType = 'default';
		},
		getCfg: function() {
			var text;
			var cfgType = this.getCfgType();

			$.ajax({
				url: 'configs/' + cfgType + '/',
				method: 'GET',
				//url: '../static/mainscreen/tempcfg/empty.json',
				//url: '../static/mainscreen/tempcfg/katrin_final.json',
				//url: '../static/mainscreen/tempcfg/katrin_final_nodouble.json',
				//url: '../static/mainscreen/tempcfg/tabs.json',
				async: false,
				dataType: 'text', //explicitly requesting the xml as text, rather than an xml document
				success: function(data) {
					var parsed_unicode = JSON.parse(data);
					text = JSON.parse(parsed_unicode['content']);
				}
			});

			return text;
		},
		initialize: function(options) {
			var self = this; //for refering to this in jquery

			this.eventAggregator.trigger('onuseratmainscreen');

			var prsObj = this.getCfg();
			var type = this.getCfgType();

			this.setOrientation(type);

			this.checkScreenField(prsObj);
			this.checkMainField(prsObj);

			this.detectSizes(this.settings.blocksize, this.settings.size[0], this.settings.size[1], '#banner', '#footer', prsObj['screen']);
			this.compileBoardTemplate(prsObj);
		},
		compileBoardTemplate: function (prsObj) {
			var compiledTemplate = _.template(boardTemplate, {});
			this.container.append(compiledTemplate);
			/* board insertion part */
			this.deserialize(prsObj);
		},
		setOrientation: function (type) {
			this.settings.isportrait = (type === "portrait");
		},
		checkScreenField: function (prsObj) {
			if (prsObj['screen']) {

				this.settings.blocksize = prsObj['screen']['blocksize'] || this.settings.blocksize;

				this.settings.size[0] = prsObj['screen']['boardsize'][0] || this.settings.size[0];

				this.settings.size[1] = prsObj['screen']['boardsize'][1] || this.settings.size[1];

				this.settings['sizecoeff'] = prsObj['screen']['sizecoeff'] || this.settings.sizecoeff;

				if (prsObj['screen']['nofooter']) {
					$('#banner').css('height', '0');
				}

				if (prsObj['screen']['nobanner']) {
					$('#footer').css('height', '0');
				}
			}
		},
		checkMainField: function (prsObj) {
			if (prsObj['main']) {
				this.settings.issimulation = prsObj['main']['issimulation'] || this.settings.issimulation;
			}
		},
		detectSizes: function(blockSize, xBlocks, yBlocks, bannerId, footerId, options) {
			//try {
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

			//} catch (err) {
			//	throw new Error('Error in size detection');
			//}
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
		start: function () {
			this.widgetController.enableFetchingData();
			this.widgetController.updateAllSensors();
		},
		startSimulation: function() {
			this.widgetController.simulateDataFetching();
		},
		deserialize: function(prsObj) {
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
								$('#on-grid').click(function(e) {
									self.grid.toggleGrid();
								});
							}

							WidgetController.initializeBoard(this, attr);
						}
				}
			}

			if (prsObj["main"] && prsObj["main"]["issimulation"]) {
				console.log('OLOLO');
				this.startSimulation();
			}
			else {
				this.start();
			}

			$('.loader').hide();

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