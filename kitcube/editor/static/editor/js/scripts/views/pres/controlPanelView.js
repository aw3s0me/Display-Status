define(['jquery', 'underscore', 'backbone', 'chosen', 'text!templates/pres/controlPanel.html'], function($, _, Backbone, Chosen, ControlPanelTemplate) {

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

		    $(".sidebar-nav .box").draggable({
		    	//helper: "clone",
		    	helper: function() {
		    		return $(this).find('.helper').css('display', 'block');
		    	},
		    	handle: ".drag",
		    	drag: function(e, t) {
		    		t.helper.width(400);
		    	},
		    	stop: function() {
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