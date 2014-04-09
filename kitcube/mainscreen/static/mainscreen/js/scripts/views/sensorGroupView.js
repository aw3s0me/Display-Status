define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel', 'views/sensorView'], function($, _, Backbone, SensorGroupModel, SensorView) {
	var SensorGroupView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		group: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options}) 
			if (options.grid) {
				this.grid = options.grid;
			}

			if (options.model) {
				this.model = options.model;
			}

			if (options.group ) {
				this.group = options.group;
			}
 
			this.render();
			this.model.on('resize', this.onresize, this);
			this.model.on('changebgcolor', this.onchangebgcolor, this);
		},
		render: function() {
			var scale = this.grid.getScale();
			var newSensorGroup = this.model;
			var dx = newSensorGroup.get("size")[0];
			var dy = newSensorGroup.get("size")[1];
			var px = newSensorGroup.get("coords")[0];
			var py = newSensorGroup.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensorGroup.get('id'));

			this.container[0].style.position = 'absolute';
			this.container[0].style.fontSize = 1.8*scale +'em';
    		this.container[0].style.left = 5*scale + 'px';
    		this.container[0].innerHTML = newSensorGroup.get("name");

    		var unitX = this.grid.getUnitSizes().width;
    		var unitY = this.grid.getUnitSizes().height;

    		var newSortableContainer = $('<span></span>');
			newSortableContainer.css('left', 0 + 'px');
			newSortableContainer.css('top', unitX  + 'px');
			newSortableContainer.addClass('sortable_container').sortable();

    		if (this.group !== undefined) {
    			for (var i = 0 ; i < this.group.length; i++) {
    				var newSensorView = this.group[i];
    				var cont = this.setContainer(newSensorView);
    				newSortableContainer.append(cont);
    			}
    		}
    		else {
    			throw "groupArray wasnt initialized";
    		}
    		
    		this.container.append(newSortableContainer);

    		this.grid.addUnit(dx, dy, px, py, scale, this.container, {}, this.model).addClass('group')
    		.draggable({
           		grid: [unitX,unitY],
            	containment: 'parent',
        	})
        	.resizable({
	            grid: [unitX,unitY],
	            minWidth: 6*unitX,
	            minHeight: 7*unitY,
	            handles: 'ne, se',
	            containment: 'parent',
	            stop: function() {
	                var width = $(this).children('.sortable_container').css('width').toNum();
	                var height = $(this).children('.sortable_container').css('height').toNum();
	                alert(height+' '+$(this).css('height'));
	                if ( $(this).css('width').toNum() < width ) {
	                    $(this).css('width', width);
	                }
	                if ( $(this).css('height').toNum() < height + unitY) {
	                    $(this).css('height', height + unitY);
	                }
	            },
        	});
		},
		rerender: function() {

		},
		removeFromDom: function() {

		},
		setContainer: function(sensorView) {
			var divElem = sensorView.getContainer();
			var model = sensorView.model;
			var posx = model.get('coords')[0];
			var posy = model.get('coords')[1];
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];

			var scale = this.grid.getScale();
			var unitSizeX = this.grid.getUnitSizes().width * scale;
			var unitSizeY = this.grid.getUnitSizes().height * scale;
			divElem.css('left', posx * unitSizeX + 'px');
			divElem.css('top', posy * unitSizeY + 'px');
			divElem.css('width', dx * unitSizeX + 'px');
			divElem.css('height', dy * unitSizeY + 'px');
			divElem.data('id', model.get('id'));

			divElem.addClass('widget')
			.draggable({
				grid: [unitSizeX, unitSizeY],
				containment: "parent",
				stop: function() {
					var scale = this.grid.getScale();
					var unitSizeX = this.grid.getUnitSizes().width * scale;
					var unitSizeY = this.grid.getUnitSizes().height * scale;

					var newCoordX = parseInt(parseFloat(this.style.left) / unitSizeX);
					var newCoordY = parseInt(parseFloat(this.style.top) / unitSizeY); 	
					model.set({coords: [newCoordX, newCoordY]});
					console.log(newCoordX, newCoordY);
				}
			})
			.resizable({
				grid:unitSizeX,
				//containment: 'parent',
				handles: 'ne, se',
				//helper: 'ui-resizable-helper',
				start: function(event, ui) {

				},
				resize: function( event, ui) {
					var scale = this.grid.getScale();
					var unitSize = this.grid.getUnitSizes().width * scale;

					var oldWidth = model.get('size')[0];
					var oldHeight = model.get('size')[1];

					var newWidth = parseInt(ui.size.width / unitSize);
					var newHeight = parseInt(ui.size.height / unitSize);

					if (oldWidth === newWidth && oldHeight === newHeight) {
						return;
					}
				},
				stop: function(event, ui) {
					var scale = this.grid.getScale();
					var unitSize = this.grid.getUnitSizes().width * scale;

					var oldWidth = model.get('size')[0];
					var oldHeight = model.get('size')[1];

					var newWidth = Math.round(ui.size.width / unitSize);
					var newHeight = Math.round(ui.size.height / unitSize);
					//alert(newWidth, newHeight);
					if (oldWidth === newWidth && oldHeight === newHeight) {
						return;
					}
					model.set({ size: [newWidth, newHeight]});
					model.trigger('resize', model);
				}
			}); 

			return divElem;

		},
		onresize: function(model) {

		},
		onchangebgcolor: function(model) {

		}
	});
	return SensorGroupView;
});