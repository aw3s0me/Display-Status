define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel', 'text!templates/widgets/sensorGroup.html', 'views/widgets/emptySensorView', 'models/sensorModel'], function($, _, Backbone, SensorGroupModel, SensorGroupTemplate, EmptySensorView, Sensor) {
    
    var _denominator = 0.2;

    var SensorGroupView = Backbone.View.extend({
        container: undefined,
        grid: undefined,
        model: undefined,
        group: undefined,
        sizecoeff: 2,
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

            if (options.sizecoeff) {
                this.sizecoeff = options.sizecoeff;
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
                .addClass('sortable_container').sortable({
                    items: "li:not(.ui-state-disabled)"
                });

            if (this.group !== undefined) {
                var order = this.model.get('order');
                if (order) {
                    this.addElementsByOrder(order, newSortableContainer);
                } else {
                    this.addElements(newSortableContainer);
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

            //this.container.parent().css('border', '1px solid black');


            //console.log(this.container.html());
        },
        addElementsByOrder: function(order, newSortableContainer) {
            for (var i = 0; i < order.length; i++) {
                var elemName = order[i];
                if (elemName === "") {
                    this.addEmptySensor(newSortableContainer);
                    continue;
                }
                var newSensorView = this.group[elemName];
                var cont = this.setContainer(newSensorView);
                newSortableContainer.append(cont);
                newSensorView.on('removing', this.onSensorRemoving, this);
            }
        },
        addElements: function(newSortableContainer) {
            for (var elemName in this.group) {
                var newSensorView = this.group[elemName];
                var cont = this.setContainer(newSensorView);
                newSortableContainer.append(cont);
                newSensorView.on('removing', this.onSensorRemoving, this);
            }
            var empties = this.model.get('empties');
            for (var i = 0; i < empties; i++) {
                this.addEmptySensor(newSortableContainer);
            }
        },
        addEmptySensor: function(newSortableContainer) {
            var sizecoeff = this.sizecoeff;
            var size = [sizecoeff, sizecoeff];

            var newSensorView = new EmptySensorView({
                model: new Sensor({
                    size: size,
                }),
                grid: this.grid,
                empty: true
            });

            var cont = this.setContainer(newSensorView);
            newSortableContainer.append(cont);
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
            var groupModel = this.model;
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
            divElem.css('width', dx * unitSizeX - _denominator + 'px');
            divElem.css('height', dy * unitSizeY - _denominator + 'px');

            divElem.data('id', model.get('id'));

            divElem.addClass('subtile');

            if (groupModel.get('issortable')) {
                divElem.addClass('ui-state-disabled');
            }


            return divElem;
        },
        onresize: function(model) {},
        onchangebgcolor: function(model) {

        }
    });
    return SensorGroupView;
});