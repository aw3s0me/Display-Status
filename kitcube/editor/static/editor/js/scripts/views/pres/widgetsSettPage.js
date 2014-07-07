define(['jquery', 'underscore', 'backbone', 'text!templates/pres/modalWindow.html', 'text!templates/widgsettpages/basic-settings-page.html', 'text!templates/widgsettpages/group-sensor-box-tile-page.html', 'text!templates/widgsettpages/single-sensor-box-page.html'], function($, _, Backbone, ModalWindowTemplate, BasicTemplate, GroupSensorTilePageTemplate, SingleSensorPageTemplate) {
	var widgetsSettPage = Backbone.View.extend({
		container: $('body'),
		el: undefined,
		type: undefined,
		model: undefined,
		initialize: function(options) {
			var self = this;
			if (options && options.type) {
				this.type = options.type;
			}
			if (options.model) {
				this.model = options.model;
			}

            this.render();

            this.el.on('hide.bs.modal', function(e) {
            	self.removeFromDom();
            });
            this.el.modal('show');

            this.initModalElements();

            this.el.find('#saveWidgetSettings').click(function(event) {
            	self.saveChanges();
            });
        },
        getRenderInfo: function() {
        	if (!this.type) {
        		return false;
        	}
        	var model = this.model;
        	var template = false;
        	var baseTemplate = _.template(BasicTemplate, this.model.attributes);
        	var info = {}

        	switch(this.type) {
        		case "sensor-group-tile":
        			info = {
        				header: "Sensor group edit",
        				body: baseTemplate + _.template(GroupSensorTilePageTemplate, {})
        			}
        			break;
        		case "single-sensor":
        			info = {
        				header: "Single sensor edit",
        				body: _.template(SingleSensorPageTemplate, this.model.attributes)
        			}
        			break;
        		case "chart":
        			break;
        		case "sensor-group-table":
        			break;
        		case "alarm-list":
        			break;
        		default:
        			return false;
        	}

        	return info;
        },
        initModalElements: function() {
        	var el = this.el;
        	var model = this.model;

        	switch(this.type) {
        		case "sensor-group-tile":
        			
        			break;
        		case "single-sensor":
	        		if (!this.model)
	        			return;
	        		if (this.model.get('sensortype'))
	        			this.el.find('.chosen').find('[value="' + this.model.get('sensortype') +'"]').prop('selected', true);
        			this.el.find('.chosen').chosen({
        				width: "60%"
        			});	
        			
        			break;
        		case "chart":
        			break;
        		case "sensor-group-table":
        			break;
        		case "alarm-list":
        			break;
        		default:
        			return;
        	}

        },
        render: function() {
        	var info = this.getRenderInfo();
        	if (!info)
        		return false;

            this.el = $(_.template(ModalWindowTemplate, info));

            this.container.append(this.el);
            
        },
        removeFromDom: function() {
        	this.el.unbind();
            this.el.remove();
            this.remove();
            //console.log('MODAL REMOVED!!');
        },
        saveChanges: function() {
        	var values = this.getHtmlValues();

        	var errors = this.model.validate(values);
        	
        	if (errors) {
        		this.showErrors(errors);
        		return;
        	}


        },
        showErrors: function(errors) {
			var result = "";
			var self = this;
			_.each(errors, function(error) {
				var inpGroup = self.el.find('input[title=' + error.name + ']').parent('.input-group');
				inpGroup.addClass('has-error');
				self.el.find('span[help=' + error.name + ']').text(error.message);
				result += error.message + '\n';
			});
		},
		hideErrors: function() {
			this.el.find('.has-error').each(function() {
				$(this).removeClass('has-error');
			});
			this.el.find('.input-group-error').each(function() {
				$(this).text('');
			});
		},
        getHtmlValues: function() {
			var values = {};
			$('.settval').each(function(index, val) {
				if ($(this).is("select")) {
					values[$(this).attr('title')] = $(this).find('option:selected').val();
				}
				else {
					values[$(this).attr('title')] = $(this).val();
				}
			});

			return values;
		}
    });

    return widgetsSettPage;
});
