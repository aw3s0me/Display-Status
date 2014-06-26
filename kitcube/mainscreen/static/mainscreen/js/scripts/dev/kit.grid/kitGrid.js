var kitGrid = (function($) {
	//helpers
	function defaultFor(arg, val) {
		return typeof arg !== 'undefined' ? arg : val;
	}

	// private properties.

	//DRAG FEATURE STATIC
	var _dragElem = null;
	
	//DROP FEATURE STATIC
	var _dropElem = null;
	var _dropzones = []; //alowed dropzones
	var _isDroppable = false;
	var _tempdx = 0;
	var _tempdy = 0;
	var _self = null;

	//CANVAS SIZE STATIC
	var DEFAULT_HEIGHT = 500;
	var DEFAUL_WIDTH = 500;

	var kitGrid = function(initElement, properties) {
		var _grid = initElement;
		var _scale = _grid.data('scale');
		var _unitHeight = _grid.data('gridUnitY');
		var _unitWidth = _grid.data('gridUnitX');
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

		
		if (!_grid.hasClass('canvas')) {
			_grid.addClass('canvas');
		}

		_self = this;

		this.getGrid = function() { return _grid; };
		this.getScale = function() { return _scale; };
		this.getUnitSizes = function() { 
			return {
				height: _unitHeight,
				width: _unitWidth
			}
		}
		this.getIdOfCanvas = function() {
			return this.getGrid().attr('id');
		}

	}

	kitGrid.prototype.toggleGrid = function() {
		var holder = this.getGrid();
		var attr = holder.attr('grid');
		var scale = this.getScale();

		if (typeof attr !== 'undefined' && attr !== false) {
			holder.children('.grid').remove();
			holder.removeAttr('grid');
			return;
		}

		holder.attr('grid', 'grid');

		for (var i = 0; i < holder.data('gridSizeX'); i++)
			for (var j = 0; j < holder.data('gridSizeY'); j++) {
				var e = this.newGridBlock(1, 1, i, j);
				//e.className = 'grid';
				$(e).addClass('grid')
				.html('<div>' + i + '<br>' + j + '</div>')
				.css('font-size', 15 * scale + 'px');
				holder.append(e);
			}
		return;
	}

	kitGrid.prototype.newGridBlock = function(dx, dy, px, py, scale) {
		var e = document.createElement('div');
		var holder = this.getGrid();

		scale = typeof scale !== 'undefined' ? scale : holder.data('scale');
		e.dataset.scale = scale;

		//e.className = 'tile';
		e.style.left = px * holder.data('scaledUnitSize') + 'px';
		e.style.top = py * holder.data('scaledUnitSize') + 'px';
		e.style.width = dx * holder.data('scaledUnitSize') + 'px';
		e.style.height = dy * holder.data('scaledUnitSize') + 'px';

		return e;
	}

	kitGrid.prototype.addUnit = function(content, options, model) {
		var divElem = $('<div></div>');
		var grid = this.getGrid();
		var dx = model.get("size")[0];
        var dy = model.get("size")[1];
        var px = model.get("coords")[0];
        var py = model.get("coords")[1];
		var scale = grid.data('scale');
		var unitSizeX = grid.data('scaledUnitSize');
		var unitSizeY = grid.data('scaledUnitSize');
		divElem.css('left', px * grid.data('scaledUnitSize') + 'px');
		divElem.css('top', py * grid.data('scaledUnitSize') + 'px');
		divElem.css('width', dx * grid.data('scaledUnitSize') + 'px');
		divElem.css('height', dy * grid.data('scaledUnitSize') + 'px');
		divElem.data('id', model.get('id'));
		//console.log(grid.data('scaledUnitSize'));
		//console.log('kitgrid dxdy true: ' + dx + ": " + dy + ": " + posx + ": " + posy);
		//console.log('kitgrid dxdy true px: ' + dx * grid.data('scaledUnitSize') + ": " + dy * grid.data('scaledUnitSize') + ": " + posx * grid.data('scaledUnitSize') + ": " + posy * grid.data('scaledUnitSize'));

		divElem.addClass('tile');
		if (options) {
			if (options.border === 0) {
				divElem.css('border', 0);
				divElem.css('width', dx * grid.data('scaledUnitSize') + 'px');
			}
			if (options.border > 0) {
				divElem.css('border', 0);
				//divElem.css('border', options.border);
				divElem.css('width', dx * grid.data('scaledUnitSize') + options.border - 1 + 'px');
			}

			if (options.absolute) {
				divElem.css('left', px * scale + 'px');
				divElem.css('top', py * scale + 'px');
			}
			if (options.transparent) {
				divElem.css('background-color', 'rgba(204,204,204,0)')
			}
		}

		divElem.append(content);

		grid.append(divElem);

		// this.gridObjects[model.get('id')] = {
		// 	html: divElem,
		// 	model: model
		// }

		var self = this;

		divElem.addClass('widget');
		if (options && options.resizable) {
			this.applyResizable(divElem, model)
		}
		if (options && options.draggable) {
			this.applyDraggable(divElem, model);
		}

		return divElem;
	}

	kitGrid.prototype.applyResizable = function(element, model) {
		var self = this;
		var grid = this.getGrid();
		var dx = model.get("size")[0];
        var dy = model.get("size")[1];
        var px = model.get("coords")[0];
        var py = model.get("coords")[1];

		element.resizable({
				grid: grid.data('scaledUnitSize'),
				//containment: 'parent',
				handles: 'se',
				//helper: 'ui-resizable-helper',
				start: function(event, ui) {

				},
				resize: function(event, ui) {
					var unitSize = grid.data('scaledUnitSize');

					var oldWidth = model.get('size')[0];
					var oldHeight = model.get('size')[1];

					var newWidth = Math.round(ui.size.width / unitSize);
					var newHeight = Math.round(ui.size.height / unitSize);

					if (oldWidth === newWidth && oldHeight === newHeight) {
						return;
					}
				},
				stop: function(event, ui) {
					var unitSize = grid.data('scaledUnitSize');

					var oldWidth = model.get('size')[0];
					var oldHeight = model.get('size')[1];

					var newWidth = Math.round(ui.size.width / unitSize);
					var newHeight = Math.round(ui.size.height / unitSize);
					//alert(newWidth, newHeight);
					if (oldWidth === newWidth && oldHeight === newHeight) {
						return;
					}
					model.set({
						size: [newWidth, newHeight]
					});
					model.trigger('resize', model);
				}
			});
	}

	kitGrid.prototype.applyDraggable = function(element, model) {
		var self = this;
		var grid = this.getGrid();
		var dx = model.get("size")[0];
        var dy = model.get("size")[1];
        var px = model.get("coords")[0];
        var py = model.get("coords")[1];

		element.draggable({
				grid: [grid.data('scaledUnitSize'), grid.data('scaledUnitSize')],
				//containment:  [containmentX1, containmentY1, containmentX2, containmentY2],
				drag: function(e, ui) {
					var scale = grid.data('scale');
					var unitSizeX = grid.data('scaledUnitSize');
					var unitSizeY = grid.data('scaledUnitSize');
					var maxSizeX = grid.data('gridSizeX') - dx;
					var maxSizeY = grid.data('gridSizeY') - dy;
					var oldPosLeft = ui.position.left;
					var oldPosTop = ui.position.top;

					var newCoordX = Math.round(parseFloat(ui.position.left) / unitSizeX);
					var newCoordY = Math.round(parseFloat(ui.position.top) / unitSizeY);

					if (newCoordY > maxSizeY || newCoordX > maxSizeX || newCoordX < 0 || newCoordY < 0) {
						ui.position.left = ui.position.left_old
      					ui.position.top = ui.position.top_old
						return true;
						//divElem.trigger('mouseup');
						//divElem.draggable( 'option',  'revert', true ).trigger( 'mouseup' );
						//ui.position.left = oldPosLeft;
						//ui.position.top = oldPosTop;
					} 

				},
				//containment: "parent",
				stop: function() {
					var scale = grid.data('scale');
					var unitSizeX = grid.data('scaledUnitSize');
					var unitSizeY = grid.data('scaledUnitSize');

					var newCoordX = Math.round(parseFloat(this.style.left) / unitSizeX);
					var newCoordY = Math.round(parseFloat(this.style.top) / unitSizeY);
					model.set({
						coords: [newCoordX, newCoordY]
					});
					//console.log(newCoordX, newCoordY);
				}
			});
	}

	kitGrid.prototype.resizeTile = function(posx, posy, dx, dy, tile) {
		var grid = this.getGrid();
		tile.css('left', posx * grid.data('scaledUnitSize') + 'px');
		tile.css('top', posy * grid.data('scaledUnitSize') + 'px');
		tile.css('width', dx * grid.data('scaledUnitSize') + 'px');
		tile.css('height', dy * grid.data('scaledUnitSize') + 'px');
	}

	kitGrid.prototype.addByClick = function(dx, dy, absPosX, absPosY, scale, content) {
		var divElem = $('<div></div>');
		scale = defaultFor(scale, this.getGrid().data('scale'));
		divElem.css('left', absPosX + 'px');
		divElem.css('top', absPosY + 'px');
		divElem.css('width', dx * this.getGrid().data('scaledUnitSize') + 'px');
		divElem.css('height', dy * this.getGrid().data('scaledUnitSize') + 'px');

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

		this.getGrid().append(divElem);
		//console.log(this.getGrid());
		divElem.draggable({
			containment: "parent",
			grid: [unitSizeX, unitSizeY]
		});

		var self = this;
		/*divElem.find(".close").click(function(event) {
			self.removeUnit(divElem);
		});; */
		return divElem;
	}



	/*kitGrid.prototype.removeUnit = function(elem) {
		if (elem) {
			elem.remove();
		}


	} */



	return kitGrid;
})(jQuery);