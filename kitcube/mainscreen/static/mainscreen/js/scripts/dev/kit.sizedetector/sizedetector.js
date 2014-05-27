var sizeDetector = (function($) {

	var sizeDetector = function(unitSize, gridDx, gridDy, bannerId, footerId, properties) {
		//banner id, for classes should be .classname, for divId #id
		var options = $.extend({
			marginUDFactor: 0.04, //Up Down factor
			marginLRFactor: 0.01, //Left Right margin
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

		this.maxGridSizes = {
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

		this.scale = undefined;

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

	sizeDetector.prototype.detectAllSizes = function() {
		this.detectFooterSize();
		this.detectBannerSize();
		this.detectMaxGridSizes();
		this.detectScale();
		this.detectScaledUnitSize();
		this.detectBoardSizes();
		this.detectScaledUnitSize();
	}

	sizeDetector.prototype.detectScale = function() {
		var scaleWidth = this.maxGridSizes.width / (this.unitSize * this.gridSize.width);
		var scaleHeight = this.maxGridSizes.height / (this.unitSize * this.gridSize.height);

		this.scale = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;
		this.scale = Math.floor(this.scale * 100) / 100;

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
		this.maxGridSizes.width = (this.windowSize.width - 2 * this.boardMargin.width - this.panelRightWidth - this.panelLeftWidth);
		this.maxGridSizes.height = (this.windowSize.height - this.bannerSize.height - this.footerSize.height - 2 * this.boardMargin.height);
		if (this.maxGridSizes.width === NaN || this.maxGridSizes.height === NaN) {
			throw "Error happened while detecting size of board";
		}

		return this.maxGridSizes;
	}

	sizeDetector.prototype.detectBoardSizes = function() {
		//find size for fullscreen
	
		//this.boardSizePx.width = this.gridSize.width * this.scaledUnitSize;
		//this.boardSizePx.height = this.gridSize.height * this.scaledUnitSize;
		this.boardSizePx.width = parseInt(this.maxGridSizes.width / this.scaledUnitSize);
		this.boardSizePx.height = parseInt(this.maxGridSizes.height / this.scaledUnitSize);

		if (this.boardSizePx.width === NaN || this.boardSizePx.height === NaN) {
			throw "Error happened while detecting size of board";
		}

		return this.boardSizePx;
	}

	sizeDetector.prototype.detectGridSizes = function() {


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