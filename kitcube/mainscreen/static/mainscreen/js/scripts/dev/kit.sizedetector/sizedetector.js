var sizeDetector = (function($) {

	var sizeDetector = function(unitSize, gridDx, gridDy, bannerId, footerId, properties) {
		//banner id, for classes should be .classname, for divId #id
		var options = $.extend({
			//marginUDFactor: 0.04, //Up Down factor
			//marginLRFactor: 0.01, //Left Right margin
			marginUDFactor: 0, //Up Down factor
			marginLRFactor: 0, //Left Right margin
			marginBlockFactor: 0 * 0.01
		}, properties);

		this.bannerId = bannerId;
		this.footerId = footerId;

		this.screenSize = {
			height: screen.height,
			width: screen.width
		};
		this.windowSize = { height: $(window).height(), width: $(window).width() };
		//without taskbar
		this.availScreenSize = {
			height: screen.availHeight,
			width: screen.availWidth
		};

		this.maxGridSizesPx = {
			height: undefined,
			width: undefined
		};

		//sizes of block, if unidDx-Dy make 50
		this.scaledUnitSize = undefined;

		this.gridSize = {
			height: gridDy,
			width: gridDx
		};

		this.unitSize = unitSize;

		this.boardMargin = {
			height: options.marginUDFactor * this.screenSize.height, //multiply factor to screen height
			width: options.marginLRFactor * this.screenSize.width
		};

		this.blockMargin = options.marginBlockFactor * this.screenSize.height;

		this.panelSize = { //in case of some panel

		};
		//to findBoardSize
		this.boardSizePx = { //Screen size when fullscreen
			height: undefined,
			width: undefined
		};

		this.bannerSize = {
			height: undefined,
			width: undefined
		};
		this.footerSize = {
			height: undefined,
			width: undefined
		};

		this.marginTop = 0;

		this.scale = undefined; //height scale
		this.scaleW = undefined; //width scale

		this.panelLeftWidth = 0;
		this.panelRightWidth = 0;
	};

	//hepler private functions that are visible only in this module scope

	function roundToEven(number) {
		var newSize = Math.floor(number);
		if (!(newSize % 2))
			return newSize;
		else {
			return newSize - 1;
		}
	}

	sizeDetector.prototype.detectBannerSize = function(newBannerId) {
		//this.bannerHeight = $(bannerName).height;
		//offsetSize vs clientHeight - offsetSize return size with border, scrollBar, padding
		//var banner = $('#banner');
		if ((this.bannerId === undefined || this.bannerId === "") && (newBannerId === undefined || newBannerId === "")) {
			console.log("banner wasnt initialized");
			throw "banner wasnt initialized";
		}
		var banner = (this.bannerId === undefined) ? $(newBannerId) : $(this.bannerId);
		if (!banner) {
			console.log("banner is not initialized");
			return null;
		}
		banner = banner[0];
		this.bannerSize.height = banner.offsetHeight;
		this.bannerSize.width = banner.offsetWidth;
		return this.bannerSize;
	};

	sizeDetector.prototype.detectFooterSize = function(newFooterId) {
		if ((this.footerId === undefined || this.footerId === "") && (newFooterId === undefined || newFooterId === "")) {
			console.log("footer wasnt initialized");
			throw "footer wasnt initialized";
		}
		var footer = (this.footerId === undefined) ? $(newFooterId) : $(this.footerId);
		if (!footer) {
			console.log("footer is not initialized");
		}
		var footer = footer[0];
		this.footerSize.height = footer.offsetHeight;
		this.footerSize.width = footer.offsetWidth;
		return this.footerSize;
	};

	sizeDetector.prototype.detectBasicSizes = function() {
		this.detectFooterSize();
		this.detectBannerSize();
		this.detectMaxGridSizes();
		this.detectScale();
		this.detectScaledUnitSize();

	}

	sizeDetector.prototype.detectSizesForFluidCanvas = function() {
		this.detectBasicSizes();
		this.detectGridSizesFluid();
		this.detectBoardSizes();
		this.detectMarginTopSize();
	}

	sizeDetector.prototype.detectSizesForFixedCanvas = function() {
		this.detectBasicSizes();
		this.detectBoardSizes();
		this.detectMarginTopSize();
	}

	sizeDetector.prototype.detectScale = function() {
		var scaleWidth = this.maxGridSizesPx.width / (this.unitSize * this.gridSize.width);
		var scaleHeight = this.maxGridSizesPx.height / (this.unitSize * this.gridSize.height);

		this.scale = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;
		this.scale = Math.floor(this.scale * 100) / 100;

		console.log(this.scale);

		if (this.scale === undefined || this.scale === NaN) {
			throw "Error in detecting scale";
		}

		return this.scale;
	}

	sizeDetector.prototype.detectScaledUnitSize = function() {
		this.scaledUnitSize = Math.round(this.scale * this.unitSize);
		return this.scaledUnitSize;
	}

	sizeDetector.prototype.detectMaxGridSizes = function() {
		//var ratio =  

		this.maxGridSizesPx.height = (this.windowSize.height - this.bannerSize.height - this.footerSize.height - 2 * this.boardMargin.height);
		this.windowSize.width = (this.maxGridSizesPx.height * this.gridSize.width) / this.gridSize.height;
		console.log(this.windowSize.width);
		this.maxGridSizesPx.width = (this.windowSize.width - 2 * this.boardMargin.width - this.panelRightWidth - this.panelLeftWidth);


		if (this.maxGridSizesPx.width === NaN || this.maxGridSizesPx.height === NaN) {
			throw "Error happened while detecting size of board";
		}

		return this.maxGridSizesPx;
	}

	sizeDetector.prototype.detectGridSizesFluid = function() {
		//find size for fullscreen
	
		//this.boardSizePx.width = this.gridSize.width * this.scaledUnitSize;
		//this.boardSizePx.height = this.gridSize.height * this.scaledUnitSize;
		this.gridSize.width = parseInt(this.maxGridSizesPx.width / this.scaledUnitSize);
		this.gridSize.height = parseInt(this.maxGridSizesPx.height / this.scaledUnitSize);

		if (this.boardSizePx.width === NaN || this.boardSizePx.height === NaN) {
			throw "Error happened while detecting size of board";
		}

		return this.gridSize;
	}

	sizeDetector.prototype.detectBoardSizes = function() {
		//find size for fullscreen
	
		this.boardSizePx.width = this.gridSize.width * this.scaledUnitSize;
		this.boardSizePx.height = this.gridSize.height * this.scaledUnitSize;

		if (this.boardSizePx.width === NaN || this.boardSizePx.height === NaN) {
			throw "Error happened while detecting size of board";
		}

		return this.boardSizePx;
	}

	sizeDetector.prototype.detectMarginTopSize = function() {
		if (this.boardMargin.height === 0) {
			this.marginTop = this.bannerSize.height - this.footerSize.height;
			return this.marginTop;
		}

		this.marginTop = this.windowSize.height - this.bannerSize.height - this.footerSize.height - this.maxGridSizesPx.height;
		this.marginTop = this.marginTop / 2;
		return this.marginTop;
	}

	sizeDetector.prototype.detectScaledUnitSize = function() {
		if (this.scale === undefined) {
			throw "Scale wasnt initialized";
		}
		this.scaledUnitSize = this.scale * this.unitSize;
		//ret array of board sizes
		return this.scaledUnitSize;
	};

	sizeDetector.prototype.ifFullScreen = function() {
		return window.navigator.standalone || (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen) || (!window.screenTop && !window.screenY);
	};

	sizeDetector.prototype.updateScreenSize = function() {
		this.screenSize.height = screen.height;
		this.screenSize.width = screen.width;

		return this.screenSize;
	};

	sizeDetector.prototype.doIfFullScreen = function(event) {
		console.log('fullscreen');
	};

	sizeDetector.prototype.doIfNotFullScreen = function(event) {
		console.log('notfullscreen');
	};

	sizeDetector.prototype.setScreen = function(wrapper, content, kicubeCanv) {

	}

	return sizeDetector;

})(jQuery);