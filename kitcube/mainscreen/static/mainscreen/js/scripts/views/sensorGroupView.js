define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel', 'views/sensorView', 'views/trendSensorView'], function($, _, Backbone, SensorGroupModel, SensorView) {
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
			this.model.on('change:bgcolor', this.onchangebgcolor, this);
		},
		render: function() {
			var trendChartInitArr = [];

			var scale = this.grid.getScale();
			var newSensorGroup = this.model;
			var dx = newSensorGroup.get("size")[0];
			var dy = newSensorGroup.get("size")[1];
			var px = newSensorGroup.get("coords")[0];
			var py = newSensorGroup.get("coords")[1];
			var self = this;

			this.container = $('<div></div>');
			this.container.attr('id', newSensorGroup.get('id'));

			var s0 = document.createElement('div');
    		s0.style.position = 'absolute';
    		s0.style.fontSize = 1.4*scale+'em';
    		s0.style.left = 5*scale + 'px';
    		s0.style.fontWeight = 'bold';
    		s0.innerHTML = newSensorGroup.get("name");
    		this.container.append($(s0));

			/*this.container[0].style.position = 'absolute';
			this.container[0].style.fontSize = 1.8*scale +'em';
    		this.container[0].style.left = 5*scale + 'px';
    		this.container[0].innerHTML = newSensorGroup.get("name"); */

    		var unitX = this.grid.getUnitSizes().width * scale;
    		var unitY = this.grid.getUnitSizes().height * scale;

    		var newSortableContainer = $('<span></span>');
			newSortableContainer.css('left', 0 + 'px');
			newSortableContainer.css('top', unitY + 'px');
			newSortableContainer.css('height', unitY * (dy - 1) + 'px');
			newSortableContainer.css('width', unitX * dx + 'px' )
			newSortableContainer.addClass('sortable_container').sortable();

    		if (this.group !== undefined) {
    			for (var i = 0 ; i < this.group.length; i++) {
    				var newSensorView = this.group[i];
    				var cont = this.setContainer(newSensorView);
    				newSortableContainer.append(cont);
    				if (newSensorView.isTrend) {
    					trendChartInitArr.push(newSensorView);
    				}
    			}
    		}
    		else {
    			throw "groupArray wasnt initialized";
    		}
    		
    		this.container.append(newSortableContainer);

    		this.grid.addUnit(dx, dy, px, py, scale, this.container, {}, this.model).addClass('group')
    		.draggable({
           		grid: [unitX, unitY],
            	containment: 'parent',
        	})
        	.resizable({
				grid: unitX,
				//containment: 'parent',
				handles: 'ne, se',
				//helper: 'ui-resizable-helper',
				start: function(event, ui) {},
				resize: function( event, ui) {},
				stop: function(event, ui) {
					var model = self.model;
					var unitSize = unitX;

					var oldWidth = model.get('size')[0];
					var oldHeight = model.get('size')[1];

					var newWidth = Math.round(ui.size.width / unitSize);
					var newHeight = Math.round(ui.size.height / unitSize);
					//alert(newWidth, newHeight);
					if (oldWidth === newWidth && oldHeight === newHeight) {
						return;
					}
					self.model.set({ size: [newWidth, newHeight]});
					$(this).find('.sortable_container').css('width', $(this).css('width'));
                	$(this).find('.sortable_container').css('height', parseInt($(this).css('height'))-unitY);
					self.model.trigger('resize', model);
				}
			}); 

        	for (var i = 0; i < trendChartInitArr.length; i++) {
        		var view = trendChartInitArr[i];
        		view.trigger('chartInit');
        	}

        	//for (var i = 0; i < )

		},
		rerender: function() {

		},
		removeFromDom: function() {

		},
		setContainer: function(sensorView) {
			var divElem = sensorView.getContainer();
			var model = sensorView.model;
			var posx = 0;
			var posy = 0;
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];

			var scale = this.grid.getScale();
			var unitSizeX = this.grid.getUnitSizes().width * scale;
			var unitSizeY = this.grid.getUnitSizes().height * scale;
			divElem.css('left', posx * unitSizeX + 'px');
			divElem.css('top', posy * unitSizeY + 'px');
			divElem.css('width', dx * unitSizeX + 'px');
			divElem.css('height', dy * unitSizeY + 'px');


			//sensorModel.set({ bgcolor: color });
			//sensorModel.trigger('changebgcolor', sensorModel);

			divElem.data('id', model.get('id'));

			//divElem.addClass('widget');
			divElem.addClass('subtile');
			/*.draggable({
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
			}); */

			return divElem;

		},
		onresize: function(model) {
			var ololo = 1;
		},
		onchangebgcolor: function(model) {

		}
	});
	return SensorGroupView;
});