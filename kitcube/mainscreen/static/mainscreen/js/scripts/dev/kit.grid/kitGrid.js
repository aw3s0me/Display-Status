var kitGrid = (function($) {
	//helpers
	function defaultFor(arg, val) {
		return typeof arg !== 'undefined' ? arg : val;
	}

	// private properties.

	//DRAG FEATURE
	var _dragElem = null;
	var _grid = null;

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

	var DEFAULT_HEIGHT = 500;
	var DEFAUL_WIDTH = 500;

	function kitGrid(initDivClass, properties) {
		this.matrix = [];
		this.gridObjects = {
			html: undefined,
			model: undefined 
		}

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

		if (!_grid.hasClass('canvas')) {
			_grid.addClass('canvas');
		}

		_self = this;

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

	kitGrid.prototype.addUnit = function(dx, dy, posx, posy, scale, content, options, model) {
		var divElem = $('<div></div>');
		scale = defaultFor(scale, _grid.data('scale'));
		var unitSizeX = _grid.data('gridUnitX') * scale;
		var unitSizeY = _grid.data('gridUnitY') * scale;
		divElem.css('left', posx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('top', posy * _grid.data('gridUnitY') * scale + 'px');
		divElem.css('width', dx * _grid.data('gridUnitX') * scale + 'px');
		divElem.css('height', dy * _grid.data('gridUnitY') * scale + 'px');
		divElem.data('id', model.get('id'));

		divElem.addClass('tile');
		if (options) {
			if (options.border === 0) {
				divElem.css('border', 0);
				divElem.css('width', dx * _grid.data('gridUnitX') * scale + 'px');
			}
			if (options.absolute) {
				divElem.css('left', posx * scale + 'px');
				divElem.css('top', posy * scale + 'px');
			}
			if (options.transparent) {
				divElem.css('background-color', 'rgba(204,204,204,0)')
			}
		}

		divElem.append(content);

		_grid.append(divElem);

		this.gridObjects[model.get('id')] = {
			html: divElem,
			model: model
		}

		divElem.addClass('widget')
			.draggable({
				grid: [unitSizeX, unitSizeY],
				containment: "parent",
				stop: function() {
					var scale = _grid.data('scale');
					var unitSizeX = _grid.data('gridUnitX') * scale;
					var unitSizeY = _grid.data('gridUnitY') * scale;

					var newCoordX = parseInt(parseFloat(this.style.left) / unitSizeX);
					var newCoordY = parseInt(parseFloat(this.style.top) / unitSizeY); 	
					model.set({coords: [newCoordX, newCoordY]});
					console.log(newCoordX, newCoordY);
				}
			})
			.resizable({
				grid: [unitSizeX, unitSizeY],
				minWidth: unitSizeX,
				minHeight: unitSizeY,
				//containment: 'parent',
				handles: 'ne, se',
				helper: 'ui-resizable-helper',
				disable: true,
				resize: function( event, ui) {
					var scale = _grid.data('scale');
					var unitSizeX = _grid.data('gridUnitX') * scale;
					var unitSizeY = _grid.data('gridUnitY') * scale;

					var newWidth = ui.size.width / unitSizeX;
					var newHeight = ui.size.height / unitSizeY;

					trigger()

					console.log(ui.originalPosition);

					//console.log('resize to: ' + ui.originalPosition);
				},
				stop: function(event, ui) {

				}
			}); 
			

		/*divElem.draggable({ 
			grid: [unitSizeX, unitSizeY],
			containment: "parent",
			stop: function() {

				var scale = _grid.data('scale');
				var unitSizeX = _grid.data('gridUnitX') * scale;
				var unitSizeY = _grid.data('gridUnitY') * scale;

				var newCoordX = parseInt(parseFloat(this.style.left) / unitSizeX);
				var newCoordY = parseInt(parseFloat(this.style.top) / unitSizeY); 	
				model.set({coords: [newCoordX, newCoordY]});
				console.log(newCoordX, newCoordY);
			}
		});  */

		var self = this;
		divElem.find(".close").click(function(event) {
			self.removeUnit(divElem);
		});
		return divElem;
	}

	kitGrid.prototype.resizeTile = function(posx, posy, dx, dy, tile) {
		tile.css('left', posx * _grid.data('gridUnitX') * _grid.data('scale') + 'px');
		tile.css('top', posy * _grid.data('gridUnitY') * _grid.data('scale') + 'px');
		tile.css('width', dx * _grid.data('gridUnitX') * _grid.data('scale') + 'px');
		tile.css('height', dy * _grid.data('gridUnitY') * _grid.data('scale') + 'px');
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

		this.gridObjects[model.get('id')] = {
			html: divElem,
			model: model
		}

		_grid.append(divElem);
		console.log(_grid);
		divElem.draggable({ 
			containment: "parent", 
			grid: [unitSizeX, unitSizeY] 
		});

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



	return kitGrid;
})(jQuery);