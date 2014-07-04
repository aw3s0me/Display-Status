define(['jquery', 'underscore', 'backbone', 'chosen', 'text!templates/pres/controlPanel.html', 'text!templates/ghosts/single-sensor-box.html', 'text!templates/ghosts/group-sensor-box-tile.html', 'text!templates/ghosts/group-sensor-box-table.html', 'text!templates/ghosts/chart-box.html', 'text!templates/ghosts/alarm-list-box.html'], function($, _, Backbone, Chosen, ControlPanelTemplate, SingleSensorBoxGhost, GroupSensorBoxTileGhost, GroupSensorBoxTableGhost, ChartBoxGhost, AlarmListBoxGhost) {

	var ControlPanelView = Backbone.View.extend({
		//container: $('#wrapper'),
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
			var self = this;
			$(".nav-header").click(function () {
		        $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
		        $(this).next().slideDown()
		    });

		    $('#showCntrlPanel').click(function(event) {
		    	self.open();
		    });

		    var sidebarBoxes = $(".sidebar-nav .box");
			if (!sidebarBoxes) {
				return;
			}

			//var overHelper = $("<div class='overHelper'></div>");
			//var unitSize = this.grid.getUnitSizes().height * this.grid.getScale();

			sidebarBoxes.draggable({
		    	cursor: "move",
		    	cursorAt: { top: 4, left: 4},
		    	helper: function() {
		    		var helperDiv = false;
		    		switch($(this).attr('data')) {
		    			case "single-sensor-box": {
		    				helperDiv = _.template(SingleSensorBoxGhost, {});
		    				break;
		    			}
		    			case "group-sensor-box-tile": {
		    				helperDiv = _.template(GroupSensorBoxTileGhost, {});
		    				break;
		    			}
		    			case "group-sensor-box-table": {
		    				helperDiv = _.template(GroupSensorBoxTableGhost, {});
		    				break;
		    			}
		    			case "alarm-list-box": {
		    				helperDiv = _.template(AlarmListBoxGhost, {});
		    				break;
		    			}
		    			case "chart-box": {
		    				helperDiv = _.template(ChartBoxGhost, {});
		    				break;
		    			}
		    		} 

		    		return helperDiv;
		    	},
		    	handle: ".drag",
		    	//revert: "invalid",
		    	start: function(event, ui) {
		    		//$(ui.helper).css('left', event.clientX - $(event.target).offset().left);
		    		//$(ui.helper).css('top', event.clientY - $(event.target).offset().top);
		    	},
		    	drag: function(e, t) {
		    		/*event.preventDefault();
					var oldCoordX = overHelper.data('coordX');
					var oldCoordY = overHelper.data('coordY');
					var draggable = ui.draggable;
						//var newWidth = Math.round(ui.size.width / unitSize);
						//var newHeight = Math.round(ui.size.height / unitSize);
					var coordX = ui.helper.offset().left - $(this).offset().left;
					var coordY = ui.helper.offset().top;
					console.log([coordX, coordY]);
					var relCoordX = parseInt(coordX/unitSize);
					var relCoordY = parseInt(coordY/unitSize);
					console.log([relCoordX, relCoordY]);
					if (oldCoordX === relCoordX && oldCoordY === relCoordY) {
						return false;
					}
					var sizes = draggable.attr('def_sizes').split(',');
					var coords = [sizes[0] * unitSize, sizes[1] * unitSize]; */


		    	},
		    	stop: function() {
		    		//$(this).append(ui.helper);
		    		//add to board
		    	}
		    });

		},
		render: function() {
			var compiledTemplate = _.template(ControlPanelTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#controlPanel');
			
		},
		open: function() {
			$('body').toggleClass('bodytoleft');
			this.el.toggleClass('sidebar-nav-open');
		},
		destroyView: function() {
			$('body').removeClass('bodytoleft');
			$(".nav-header").unbind();
			$('#showCntrlPanel').unbind();
			this.remove();
			this.el.remove();
  			this.unbind();
		}
	})

	return ControlPanelView;
});