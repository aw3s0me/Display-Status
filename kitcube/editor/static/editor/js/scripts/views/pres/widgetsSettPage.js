define(['jquery', 'underscore', 'backbone', 'text!templates/pres/modalWindow.html'], function($, _, Backbone, ModalWindowTemplate) {
	var widgetsSettPage = Backbone.View.extend({
		container: $('body'),
		initialize: function(options) {
            this.render();
        },
        render: function() {
            this.el = $(_.template(ModalWindowTemplate, { 
            	body: '<h1>AHHAH</h1>',
            	header: 'OLOLO' 
            }));

            this.container.append(this.el);
            this.el.modal('open');
        },
        removeFromDom: function() {
            this.el.remove();
            this.remove();
        }
    });

    return widgetsSettPage;
});
