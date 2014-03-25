var kitGrid = (function($) {
	//helpers
	function defaultFor(arg, val) {
		return typeof arg !== 'undefined' ? arg : val;
	}

	// private properties.

	//DRAG FEATURE
	var _dragElem = null;
	var _grid = null;
	var _elementsArr = [];

	//DROP FEATURE
	var _dropElem = null;
	var _dropzones = []; //alowed dropzones
	var _isDroppable = false;
	var _tempdx = 0;
	var _tempdy = 0;
	var _scale = 0;
	var _self = null;

	//CANVAS SIZE
	var _unitHeight = 0;
	var _unitWidth = 0;



	// public method. Attach drag handler to an element.
	function attach(dragElem) {
		dragElem.onmousedown = _dragBegin;

		// callbacks
		dragElem.dragBegin = new Function();
		dragElem.drag = new Function();
		dragElem.dragEnd = new Function();

		return dragElem;
	};

	// private method. Begin drag process.
	function _dragBegin(e) {
		var dragElem = _dragElem = this;

		if (isNaN(parseInt(dragElem.style.left))) { //get x start coord in div
			dragElem.style.left = '0px';
		}
		if (isNaN(parseInt(dragElem.style.top))) { //get y start coord in div of tile
			dragElem.style.top = '0px';
		}

		var x = parseInt(dragElem.style.left);
		var y = parseInt(dragElem.style.top);
		//console.log("x: " + x + "y: " + y);

		e = e ? e : window.event;
		dragElem.mouseX = e.clientX;
		dragElem.mouseY = e.clientY;

		dragElem.dragBegin(dragElem, x, y);

		document.onmousemove = _drag;
		document.onmouseup = _dragEnd;
		return false;
	};

	function isOutOfBorder(x, y, offsetWidth, offsetHeight) {
		var canvas = _grid[0];
		var xMax = canvas.clientWidth - offsetWidth; //border
		var yMax = canvas.clientHeight - offsetHeight;

		if (x < 0 || y < 0 || x > xMax || y > yMax) {
			return true;
		}
	}

	// private method. Drag (move) element.
	function _drag(e) {
		var dragElem = _dragElem;
		var canvas = _grid[0];
		var xMax = canvas.clientWidth - dragElem.offsetWidth; //border
		var yMax = canvas.clientHeight - dragElem.offsetHeight;

		var x = parseInt(dragElem.style.left);
		var y = parseInt(dragElem.style.top);
		//console.log("x: " + x + "y: " + y);
		//console.log("granx: " + xMax + "grany: " + yMax);
		//check to borders
		if (x < 0) {
			x = 0;
			if (y < 0) {
				y = 0;
			}
		} else if (y < 0) {
			y = 0;
			if (x < 0) {
				x = 0;
			}
		} else if (x > xMax) {
			x = xMax;
			if (y > yMax) {
				y = yMax;
			}
		} else if (y > yMax) {
			y = yMax;
			if (x > xMax) {
				x = xMax;
			}
		}

		e = e ? e : window.event;
		dragElem.style.left = x + (e.clientX - dragElem.mouseX) + 'px';
		dragElem.style.top = y + (e.clientY - dragElem.mouseY) + 'px';

		dragElem.mouseX = e.clientX;
		dragElem.mouseY = e.clientY;

		dragElem.drag(dragElem, x, y);

		return false;
	};

	// private method. Stop drag process.
	function _dragEnd() {
		var dragElem = _dragElem;

		var x = parseInt(dragElem.style.left);
		var y = parseInt(dragElem.style.top);

		dragElem.dragEnd(dragElem, x, y);
		//null because we don't wanna to start them again or brake smth
		document.onmousemove = null;
		document.onmouseup = null;
		_dragElem = null;
	};

	var DEFAULT_HEIGHT = 500;
	var DEFAUL_WIDTH = 500;

	function kitGrid(initDivClass, properties) {
		this.matrix = [];
		this.gridObjects = [];

		var options = $.extend({
			draggable: true,
			droppable: true,
			height: DEFAULT_HEIGHT,
			width: DEFAUL_WIDTH
		}, properties);
		_grid = $(initDivClass);
		_scale = _grid.data('scale');
		_unitHeight = _grid.data('gridUnitY');
		_unitWidth = _grid.data('gridUnitX');

		console.log("scale init: " +  _grid.data('scale'));
		console.log(_grid);
		//init();
		if (!_grid.hasClass('canvas')) {
			_grid.addClass('canvas');
		}

		_self = this;
		//_grid.mousedown(mouseDown);
		//makeDraggable(_grid);
		/* Main properties */



		/*this.actions = {
			drag: {
				cursor: 'move',
				moveListener: dragMove
			},
			gesture: {
				cursor: '',
				moveListener: gestureMove
			}
		}; */
		/* Main event types*/

		this.eventTypes = [
			'resizestart',
			'resizemove',
			'resizeend',
			'dragstart',
			'dragmove',
			'dragend',
			'dragenter',
			'dragleave',
			'drop',
			'gesturestart',
			'gesturemove',
			'gestureend',
			'tap'
		];
	};

	kitGrid.prototype.getScale = function() {
		return _scale;
	}

	kitGrid.prototype.getUnitSizes = function() {
		return {
			height: _unitHeight,
			width: _unitWidth
		};
	}

	kitGrid.prototype.makeDraggable = function(elem) {
		console.log('elem is draggable ' + elem);
		elem.onmousedown = (mouseDown);
	}

	kitGrid.prototype.addUnit = function(dx, dy, posx, posy, scale, content) {
		var divElem = $('<div></div>');
		scale = defaultFor(scale, _grid.data('scale'));
		divElem.css('left', posx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('top', posy * _grid.data('gridUnitY') * scale + 'px');
		divElem.css('width', dx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('height', dy * _grid.data('gridUnitY') * scale + 'px');

		divElem.addClass('tile');
		divElem.append(content);
		var elemObj = {
			object: divElem,
			posx: posx,
			posy: posy,
			dx: dx,
			dy: dy
		}
		this.gridObjects.push(elemObj);
		//this.makeDraggable(_grid);
		_grid.append(divElem);
		console.log(_grid);
		//divElem.draggable();
		//this.makeDraggable(divElem[0]);
		attach(divElem[0]);
		var self = this;
		divElem.find(".close").click(function(event) {
			self.removeUnit(divElem);
		});;
		return divElem;
	}

	kitGrid.prototype.addUnitByAbsolutePos = function(dx, dy, absPosX, absPosY, scale, content) {
		var divElem = $('<div></div>');
		scale = defaultFor(scale, _grid.data('scale'));
		divElem.css('left', absPosX * scale + 'px');
		divElem.css('top', absPosY * scale + 'px');
		divElem.css('width', dx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('height', dy * _grid.data('gridUnitY') * scale + 'px');

		divElem.addClass('tile');
		divElem.append(content);
		var elemObj = {
			object: divElem,
			posx: absPosX,
			posy: absPosX,
			dx: dx,
			dy: dy
		}
		this.gridObjects.push(elemObj);
		//this.makeDraggable(_grid);
		_grid.append(divElem);
		console.log(_grid);
		//divElem.draggable();
		//this.makeDraggable(divElem[0]);
		attach(divElem[0]);
		var self = this;
		divElem.find(".close").click(function(event) {
			self.removeUnit(divElem);
		});;
		return divElem;
	}

	kitGrid.prototype.addByClick = function(dx, dy, absPosX, absPosY, scale, content) {
		var divElem = $('<div></div>');
		scale = defaultFor(scale, _grid.data('scale'));
		divElem.css('left', absPosX + 'px');
		divElem.css('top', absPosY + 'px');
		divElem.css('width', dx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('height', dy * _grid.data('gridUnitY') * scale + 'px');

		divElem.addClass('tile');
		divElem.append(content);
		var elemObj = {
			object: divElem,
			posx: absPosX,
			posy: absPosX,
			dx: dx,
			dy: dy
		}
		this.gridObjects.push(elemObj);
		//this.makeDraggable(_grid);
		_grid.append(divElem);
		console.log(_grid);
		//divElem.draggable();
		//this.makeDraggable(divElem[0]);
		attach(divElem[0]);
		var self = this;
		divElem.find(".close").click(function(event) {
			self.removeUnit(divElem);
		});;
		return divElem;
	}



	kitGrid.prototype.removeUnit = function(elem) {
		if (elem) {
			elem.remove();
		}
	}

	function getTotalOffset() {
		var tempElem = _grid[0];
		var offset = {
			x: 0,
			y: 0
		};
		while (tempElem !== null) {
			offset.x = parseInt(offset.x) + parseInt(tempElem.offsetLeft);
			offset.y = parseInt(offset.y) + parseInt(tempElem.offsetTop);
			tempElem = tempElem.offsetParent;
		}
		return offset;
	}

	function _onclick(e) {
		var dropElem = _dropElem;

		e = e ? e : window.event;
		dropElem.mouseX = e.clientX;
		dropElem.mouseY = e.clientY;

		var offset = getTotalOffset();
		console.log("offsetX: " + offset.x + " offsetY: " + offset.y);
		console.log("mouseX: " + dropElem.mouseX + "mouseY: " + dropElem.mouseY);
		var finalX = dropElem.mouseX - offset.x;
		var finalY = dropElem.mouseY - offset.y;
		console.log("finalX: " + finalX + " finalY: " + finalY);
		if (isOutOfBorder(finalX, finalY, dropElem.offsetWidth, dropElem.offsetHeight)) {
			alert("Elem is out of border");
		} else {
			_self.addByClick(_tempdx, _tempdy, finalX, finalY, _scale, dropElem);
		}
		_grid[0].onclick = null;

		return false;
	}


	kitGrid.prototype.setInsertElem = function(pinnedElem, dx, dy) {
		_isDroppable = true;
		_dropElem = pinnedElem[0];
		console.log(_dropElem);
		_tempdx = dx;
		_tempdy = dy;
		//dropElem.dropDown = new Function();
		_grid[0].onclick = _onclick;

		return _dropElem;
	}

	kitGrid.prototype.stopInsertingElem = function() {
		_isDroppable = false;
		_dropElem = null;

		_grid[0].onclick = null;
	}


	//mousemove shouldnt been fired during drag and rop
	kitGrid.prototype.draggable = {
		dragstart: function() {

		},
		drag: function() {

		},
		dragenter: function() {

		},
		dragleave: function() {

		},
		dragover: function() {

		}
	};

	kitGrid.prototype.droppable = {
		drop: function() {

		}
	};

	kitGrid.prototype.getUnitByClass = function(className) {

	}


	kitGrid.prototype.isOccupied = function() {

	}

	return kitGrid;
})(jQuery);