//(function($) {
sizeDetector = function() /*(bannerName, footerName)*/ {
	this.screenSizeX = $(window).width(); //screen.width;
	this.screenSizeY = $(window).height();
	this.availScreenSizeX = screen.availWidth; //available size - size of windows Interface like taskbar
	this.availScreenSizeY = screen.availHeight;
	this.dx = 50; //will leave by default if there some error
	this.dy = 50;

	this.marginX = 0.05 * this.screenSizeX;
	this.marginY = 0.1 * this.screenSizeY;

	this.blockMargin = 0 * 0.01 * this.screenSizeY;

	this.panelLeftX = 0;
	this.panelRightX = 0;

	this.boardHeight = 0; //not initialized yet
	this.boardWidth = 0;

	this.xCount = 0;
	this.yCount = 0;

	this.xNumber = 0;
	this.yNumber = 0;

	this.sizeBannerDetect();
	this.sizeFooterDetect();
};

sizeDetector.prototype.ifFullScreen = function() {
	return window.navigator.standalone || (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen) || (!window.screenTop && !window.screenY);

};

sizeDetector.prototype.getFullSize = function() {
	this.screenSizeX = window.width;
	this.screenSizeY = window.height;

	return [this.screenSizeX, this.screenSizeY];
};

sizeDetector.prototype.doIfFullScreen = function(event) {
	console.log('fullscreen');
};

sizeDetector.prototype.doIfNotFullScreen = function(event) {
	console.log('notfullscreen');
};

sizeDetector.prototype.sizeBannerDetect = function() {
	//this.bannerHeight = $(bannerName).height;
	//offsetSize vs clientHeight - offsetSize return size with border, scrollBar, padding
	//var banner = $('#banner');
	var banner = document.getElementById('banner');
	if (!banner) {
		console.log("banner is not initialized");
	}
	this.bannerHeight = banner.offsetHeight;
	//console.log(this.bannerHeight);
};

sizeDetector.prototype.sizeFooterDetect = function() {
	//this.footerHeight = $(footerName).height;
	var footer = document.getElementById('footer');
	if (!footer) {
		console.log("footer is not initialized");
	}
	this.footerHeight = footer.offsetHeight;
	//console.log(this.footerHeight);
};

sizeDetector.prototype.detectBoardSize = function() {
	//console.log(this.bannerHeight);
	this.boardHeight = this.screenSizeY - this.bannerHeight - this.footerHeight - 2 * this.marginY;
	this.boardWidth = this.screenSizeX - 2 * this.marginX - this.panelRightX - this.panelLeftX;
	//console.log([this.boardWidth, this.boardHeight]);
	return [this.boardWidth, this.boardHeight];
};

sizeDetector.prototype.detectBlockCount = function() {
	function roundToEven(number) {
		var newSize = Math.floor(number);
		if (!(newSize % 2))
			return newSize;
		else {
			return newSize - 1;
		}
	}

	if (this.boardWidth || this.boardHeight) {
		this.blockMargin = roundToEven(this.blockMargin);
		this.xCount = roundToEven(this.boardWidth / (this.dx + this.blockMargin * 2));
		this.yCount = roundToEven(this.boardHeight / (this.dy + this.blockMargin * 2));
	}

	return [this.xCount, this.yCount];
};

sizeDetector.prototype.detectSizeOfBlocks = function() {
	function roundToEven(number) {
		var newSize = Math.floor(number);
		if (!(newSize % 2))
			return newSize;
		else {
			return newSize - 1;
		}
	}
	this.xCount = this.xNumber;
	this.yCount = this.yNumber;
	if (this.boardWidth || this.boardHeight) {
		this.blockMargin = roundToEven(this.blockMargin);
		this.dx = this.boardWidth / this.xNumber;
		this.dy = this.boardHeight / this.yNumber;
	}

	return [this.dx, this.dy];
};

sizeDetector.prototype.setScreen = function(wrapper, content, kicubeCanv) {
	$('body').css({
		height: this.screenSizeY
	});
	$('body').css({
		width: this.screenSizeX
	});
	wrapper.css({
		height: this.screenSizeY
	});
	wrapper.css({
		width: this.screenSizeX
	});
	content.css({
		width: this.screenSizeX
	});
	kicubeCanv.css('width', this.dx * this.xCount);
	kicubeCanv.css('height', this.dy * this.yCount);
	//kicubeCanv.css('margin-left', this.marginX);
	//kicubeCanv.css('margin-bottom', this.marginY);
	kicubeCanv.css('margin-left', 'auto');
	kicubeCanv.css('margin-right', 'auto');
	kicubeCanv.css('margin-bottom', this.marginY);
	$('footer').css('margin-top', '50px');
	kicubeCanv.children('.gridster').css('width', this.dx * this.xCount);
	//kicubeCanv.css('min-height', this.dx * this.xCount);
	//kicubeCanv.css()
	kicubeCanv.children('.gridster').css('height', this.dy * this.yCount);
	kicubeCanv.children('.gridster').children('ul').css('height', this.dy * this.yCount);
	kicubeCanv.children('.gridster').children('ul').css('width', this.dx * this.xCount);
	kicubeCanv.children('.gridster').css('height', this.dy * this.yCount);
	kicubeCanv.children('.gridster').css('width', this.dx * this.xCount);
	kicubeCanv.children('.gridster').children('ul').css('margin', 0);
	$("#kitcube-console").css('height', this.dy * this.yCount);
	$("#kitcube-console").css('min-height', this.dy * this.yCount);
}

//	return sizeDetector;

//})(jQuery);