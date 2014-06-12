define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel', 'text!templates/widgets/sensorGroup.html'], function($, _, Backbone, SensorGroupModel, SensorGroupTemplate) {
    var SensorGroupView = Backbone.View.extend({
        container: undefined,
        grid: undefined,
        model: undefined,
        group: undefined,
        empties: undefined,
        initialize: function(options) { //pass it as new SensorView({model: model, options: options}) 
            var self = this;

            if (options.grid) {
                this.grid = options.grid;
            }

            if (options.model) {
                this.model = options.model;
            }

            if (options.group) {
                this.group = options.group;
            }

            if (options.empties) {
                this.empties = options.empties;
            }

            this.render();
            this.model.on('resize', this.onresize, this);
            this.model.on('change:bgcolor', this.onchangebgcolor, this);

            this.container.find('.close').click(function(event) {
                self.removeFromDom();
            });

        },
        render: function() {
            var trendChartInitArr = [];
            var self = this;
            var scale = this.grid.getScale();
            var newSensorGroup = this.model;
            var dx = newSensorGroup.get("size")[0];
            var dy = newSensorGroup.get("size")[1];
            var unitX = this.grid.getUnitSizes().width * scale;
            var unitY = this.grid.getUnitSizes().height * scale;

            var grpSensorTemplate = $(_.template(SensorGroupTemplate, {
                group_id: newSensorGroup.get('id'),
                groupname1: this.model.get('groupname1'),
                groupname2: this.model.get('groupname2'),
                name: this.model.get('name'),
                canberemoved: newSensorGroup.get("canberemoved")
            }));

            this.container = $(grpSensorTemplate);
            this.container.find('.groupNameDiv')
                .css('font-size', 30 * scale + 'px')
                .css('left', 5 * scale + 'px');

            this.container.find('.groupName').css('font-size', 17 * scale + 'px');

            if (newSensorGroup.get('canberemoved')) {
                this.container.find('.close').css('font-size', 20 * scale + 'px')
                    .css('right', 5 * scale + 'px')
                    .css('top', 4 * scale + 'px');
            }

            var newSortableContainer = $('<span></span>')
                .css('left', 0 + 'px')
                .css('top', unitY + 'px')
                .css('height', unitY * (dy) + 'px')
                .css('width', unitX * dx + 'px')
                .addClass('sortable_container').sortable();

            if (this.group !== undefined) {
                for (var i = 0; i < this.group.length; i++) {
                    var newSensorView = this.group[i];
                    var cont = this.setContainer(newSensorView);
                    newSortableContainer.append(cont);
                    if (newSensorView.isTrend) {
                        trendChartInitArr.push(newSensorView);
                    }
                    newSensorView.on('removing', this.onSensorRemoving, this);
                }
                if (this.empties) {
                    for (var i = 0; i < this.empties.length; i++) {
                        var newSensorView = this.empties[i];
                        var cont = this.setContainer(newSensorView);
                        newSortableContainer.append(cont);
                    }
                }

            } else {
                throw "groupArray wasnt initialized";
            }

            this.container.append(newSortableContainer);

            var grpElem = this.grid.addUnit(this.container, { 
                draggable: newSensorGroup.get('isdraggable'),
                resizable: newSensorGroup.get('isresizable')
            }, this.model).addClass('group');

            if (newSensorGroup.get('isresizable')) {
                grpElem.resizable({ //different handler because its with the sortable container
                    grid: unitX,
                    //containment: 'parent',
                    handles: 'ne, se',
                    create: function(event, ui) {
                        $(this).find('div.ui-resizable-handle').css('height', 19 * scale + 'px').css('width', 20 * scale + 'px');
                    },
                    //helper: 'ui-resizable-helper',
                    start: function(event, ui) {},
                    resize: function(event, ui) {
                        $(this).find('.sortable_container').css('width', $(this).css('width') + $(this).css('border-width'));
                    },
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
                        self.model.set({
                            size: [newWidth, newHeight]
                        });
                        $(this).find('.sortable_container').css('width', $(this).css('width'));
                        $(this).find('.sortable_container').css('height', parseInt($(this).css('height')) - unitY);
                        self.model.trigger('resize', model);
                    }
                }); 
            }
            

            for (var i = 0; i < trendChartInitArr.length; i++) {
                var view = trendChartInitArr[i];
                view.trigger('chartInit');
            }

            this.container.parent().css('border', '1px solid black');

            
            //console.log(this.container.html());
        },
        rerender: function() {

        },
        removeFromDom: function() {
            for (var i = 0; i < this.group.length; i++) {
                var sensorView = this.group[i];
                sensorView.removeFromDom();
            }
            this.container.parent().remove();
            this.remove();
            this.unbind();
        },
        onSensorRemoving: function(model) {
            var collection = this.model.get('collection');
            collection.removeModel(model);
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
            divElem.css('width', dx * unitSizeX - 0.4 + 'px');
            divElem.css('height', dy * unitSizeY - 0.4 + 'px');

            //sensorModel.set({ bgcolor: color });
            //sensorModel.trigger('changebgcolor', sensorModel);

            divElem.data('id', model.get('id'));

            //divElem.addClass('widget');
            divElem.addClass('subtile');

            return divElem;

        },
        onresize: function(model) {},
        onchangebgcolor: function(model) {

        }
    });
    return SensorGroupView;
});