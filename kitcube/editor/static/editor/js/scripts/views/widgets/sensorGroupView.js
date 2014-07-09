define(['jquery', 'underscore', 'backbone', 'models/sensorGroupModel', 'text!templates/widgets/sensorGroup.html', "contextmenu", 'views/pres/widgetsSettPage', 'views/widgets/emptySensorView', 'models/sensorModel', 'views/widgets/singleSensorView'], function($, _, Backbone, SensorGroupModel, SensorGroupTemplate, contextMenu, WidgetSettWindow, EmptySensorView, Sensor, SensorView) {
    var SensorGroupView = Backbone.View.extend({
        container: undefined,
        sortableContainer: undefined,
        grid: undefined,
        model: undefined,
        group: undefined,
        sizecoeff: 2,
        ctx: undefined,
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

            if (options.ctx) {
                this.ctx = options.ctx;
            }

            this.render();
            //this.model.on('resize', this.onresize, this);
            //this.model.on('change:bgcolor', this.onchangebgcolor, this);

            this.listenTo(this.model, 'resize', this.onresize, this);
            this.listenTo(this.model, 'change:bgcolor', this.onchangebgcolor, this);
            this.listenTo(this.model, 'change:name', this.onchangename, this);

            this.container.find('.close').click(function(event) {
                self.removeFromDom();
                self.model.trigger('removing', self.model);
            });

            this.initializeDroppable();
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
                name: this.model.get('name')
            }));

            this.container = $(grpSensorTemplate);
            this.container.find('.groupNameDiv')
                .css('font-size', 30 * scale + 'px')
                .css('left', 5 * scale + 'px');

            this.container.find('.groupName').css('font-size', 17 * scale + 'px');

            this.container.find('.close').css('font-size', 20 * scale + 'px')
                .css('right', 5 * scale + 'px')
                .css('top', 4 * scale + 'px');

            this.sortableContainer = $('<span></span>')
                .css('left', 0 + 'px')
                .css('top', unitY + 'px')
                .css('height', unitY * (dy) + 'px')
                .css('width', unitX * dx + 'px')
                .addClass('sortable_container')
                .sortable({
                    update: function(event, ui) {
                        var order = $(this).sortable('toArray');
                        self.model.set({order: order});
                        console.log(order);
                    },
                    revert: true
                });

            if (this.group !== undefined) {
                var order = this.model.get('order');
                if (order) {
                    this.addElementsByOrder(order);
                } else {
                    this.addElements();
                }

            } else {
                throw "groupArray wasnt initialized";
            }

            this.container.append(this.sortableContainer);

            var grpElem = this.grid.addUnit(this.container, { 
                draggable: true,
                resizable: true
            }, this.model).addClass('group');

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
            

            for (var i = 0; i < trendChartInitArr.length; i++) {
                var view = trendChartInitArr[i];
                view.trigger('chartInit');
            }

            this.container.parent().css('border', '1px solid black');
            this.initializeContextMenu();
        
            //console.log(this.container.html());
        },
        initializeDroppable: function() {
            var self = this;
            this.container.droppable({
                accept: '.drag-sensor',
                over: function(event, ui) {
                    $(this).parent().addClass('group-over');
                    console.log('SENSOR OVER GROUP');
                },
                out: function(event, ui) {
                    $(this).parent().removeClass('group-over');
                    console.log('SENSOR OUT OF GROUP');
                },
                drop: function(event, ui) {
                    $(this).parent().removeClass('group-over');
                    var modal = new WidgetSettWindow({
                        type: "single-sensor",
                        model: new Sensor(),
                        ctx: self
                    });
                }
            })
        },
        initializeContextMenu: function() {
            var self = this;
            $.contextMenu({
                selector: '#' + self.model.get('id') + " .groupNameDiv",
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    var modal = new WidgetSettWindow({
                    	type: "sensor-group-tile",
                        model: self.model
                    });
                    console.log(m); 
                },
                items: {
                    "edit": {name: "Edit"}
                }
            });
        },
        addElementsByOrder: function(order) {
            for (var i = 0; i < order.length; i++) {
                var elemName = order[i];
                if (elemName === "") {
                    this.addEmptySensor();
                    continue;
                }
                var newSensorView = this.group[elemName];
                this.addSensorView(newSensorView);
            }
        },
        addElements: function() {
            for (var elemName in this.group) {
                var newSensorView = this.group[elemName];
                this.addSensorView(newSensorView);
            }
            var empties = this.model.get('empties');
            for (var i = 0; i < empties; i++) {
                this.addEmptySensor();
            }
        },
        addSensorView: function(newSensorView) {
            var cont = this.setContainer(newSensorView);
            this.sortableContainer.append(cont);
            newSensorView.on('removing', this.onSensorRemoving, this);
        },
        addNew: function(model) {
            var id = this.ctx.generateId(this.id || this._id, "singlesensor");
            model.set({
                id: id,
                size: [this.sizecoeff, this.sizecoeff]
            });
            console.log(id);
            var newSensorView = new SensorView({
                model: model,
                grid: this.grid,
                group: false,
                linkModel: undefined
            });

            this.addSensorView(newSensorView);
        },
        addEmptySensor: function() {
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
            this.sortableContainer.append(cont);
        },
        removeFromDom: function() {
            /*for (var i = 0; i < this.group.length; i++) {
                var sensorView = this.group[i];
                sensorView.removeFromDom();
            }*/
            for (var elemName in this.group) {
                var elem = this.group[elemName];
                elem.removeFromDom();
            }
            if (this.container.hasClass('ui-droppable')) {
                this.container.droppable('destroy');
            }
            this.container.parent().remove();
            this.remove();
            this.unbind();
        },
        onSensorRemoving: function(model) {
            var collection = this.model.get('collection');
            collection.removeModel(model);
            this.model.removeModelFromOrder(model.get('id'));
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
        onchangename: function(model) {
            this.container.find('.groupNameDiv').text(model.get('name'));
        },
        onchangebgcolor: function(model) {

        }
    });
    return SensorGroupView;
});