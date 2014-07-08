define(['jquery', 'underscore', 'backbone', 'text!templates/pres/modalWindow.html', 'text!templates/widgsettpages/basic-settings-page.html', 'text!templates/widgsettpages/group-sensor-box-tile-page.html', 'text!templates/widgsettpages/single-sensor-box-page.html', 'text!templates/widgsettpages/chart-box-page.html'], function($, _, Backbone, ModalWindowTemplate, BasicTemplate, GroupSensorTilePageTemplate, SingleSensorPageTemplate, ChartPageTemplate) {
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

			if (options && options.model) {
				this.model = options.model;
			}
            else {
                return;
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

            this.el.on('hidden.bs.modal', function() {
                $(this).data('modal', null);
                self.removeFromDom();
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
        				body: baseTemplate + _.template(GroupSensorTilePageTemplate, this.model.attributes)
        			}
        			break;
        		case "single-sensor":
        			info = {
        				header: "Single sensor edit",
        				body: _.template(SingleSensorPageTemplate, this.model.attributes)
        			}
        			break;
        		case "chart":
                    info = {
                        header: "Chart edit",
                        body: baseTemplate + _.template(ChartPageTemplate, this.model.attributes)
                    }
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
            if (!this.model)
                return;
        	switch(this.type) {
        		case "sensor-group-tile":
        			
        			break;
        		case "single-sensor":
	        		if (this.model.get('sensortype'))
	        			this.el.find('.chosen').find('[value="' + this.model.get('sensortype') +'"]').prop('selected', true);
        			this.el.find('.chosen').chosen({
        				width: "60%"
        			});	
                    
        			break;
        		case "chart":
                    if (this.model.get('range'))
                        this.el.find('.chosen').find('[value="' + this.model.get('range') +'"]').prop('selected', true);
                    this.el.find('.chosen').chosen({
                        width: "60%"
                    });
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
            this.unbind();
            console.log('MODAL REMOVED!!');
        },
        saveChanges: function() {
        	var values = this.getHtmlValues();
            //console.log(values);
            //return;

        	var errors = this.model.validate(values);
        	
        	if (errors) {
        		this.showErrors(errors);
        		return;
        	}

            if (this.model.addAttrs)
                this.model.addAttrs(values);
            //console.log(this.model.attributes);
            console.log(this.model.serialize());
            return;

            this.el.modal('hide');
        },
        showErrors: function(errors) {
			var result = "";
			var self = this;
			_.each(errors, function(error) {
				var inpGroup = self.el.find('input[title=' + error.name + ']').parent('.input-group');
				inpGroup.addClass('has-error');
				self.el.find('span[help=' + error.name + ']').text(error.message).parent().parent().show();
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
				else if ($(this).is("input")) {
                    if ($(this).attr('type') === 'checkbox') {
                        values[$(this).attr('title')] = $(this).is(":checked");
                    }
                    else {
                       values[$(this).attr('title')] = $(this).val(); 
                    }
				}
			});

			return values;
		}
    });

    return widgetsSettPage;
});
