define(['jquery', 'underscore', 'backbone', 'text!templates/widgets/alarmjQGridList.html', 'views/widgets/baseWidgetView'], function($, _, Backbone, TableTemplate, BaseWidgetView) {
    var Alarm = Backbone.Model.extend({
        defaults: function() {
            return {
                no: "",
                module: "",
                group: "",
                app: "",
                lastdata: "",
                delayedby: ""
            }
        }
    });

    var AlarmsCollection = Backbone.Collection.extend({
        model: Alarm
    });

    var AlarmList = Backbone.Model.extend({
        collection: undefined,
        defaults: function() {
            return {
                id: undefined,
                type: "alarmlist",
                size: [],
                name: "",
                coords: [],
                colnames: ['No', 'Module', 'Group', 'App', 'Last data', 'Delayed by'],
                colids: ['no', 'module', 'group', 'app', 'lastdata', 'delayedby']
            }
        },
        formDataToTable: function(data) {
            var alarmObjects = data.modules;
            var alarmsArr = [];

            $.each(alarmObjects, function(key, attr) {
                var alarm = new Alarm({no: attr['ID'], module: attr['moduleName'], group: attr['sensorGroup'], app: attr['appName'], lastdata: attr['lastData'], delayedby: attr['delayedBy']});
                alarmsArr.push(alarm);
            });

            this.collection = new AlarmsCollection(alarmsArr);

            return this.collection;
        }
    });

    var AlarmListView = BaseWidgetView.extend({
        board: undefined,
        updateInterval: undefined,
        lookuptable: {},
        jqgridHTML: undefined,
        initialize: function(attr) {
            var self = this;
            var data = undefined;
            this.widgetController = attr.wc;
			this.grid = this.widgetController.getGrid(attr);
            this.board = this.widgetController.board;

            $.getJSON('/static/mainscreen/data/alarmkitcubetest.json', function(data) { //should be .cgi
                self.model = new AlarmList({
                    id: attr['id'],
                    size: attr['size'],
                    name: attr['name'],
                    coords: attr['coords']
                });

                self.model.formDataToTable(data);

                self.render();

                self.widgetController.addViewToLookup(attr['type'], self);
            });
        },
        setUpdateInterval: function() {
        },
        removeUpdateInterval: function() {
            this.updateInterval = null;
        },
        formHeaders: function() {
            var self = this;
            var colModel = [];
            var colNames = this.model.get('colnames');
            var colIds = this.model.get('colids');
            var dx = this.model.get('size')[0];
            var unitWidth = this.grid.getUnitSizes().width;
            var scale = this.grid.getScale();
            //var elemWidth = parseInt((dx * unitWidth * scale / 6) - 2);
            var width = unitWidth * scale * dx;
            
            //colids: ['no', 'module', 'group', 'app', 'lastdata', 'delayedby']
            colModel = [
                {
                    name: 'no',
                    index: 'no',
                    sorttype: 'int',
                    width: width * 0.10,
                    cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="background:LightGray"'; }
                },
                {
                    name: 'module',
                    index: 'module',
                    width: width * 0.15
                },
                {
                    name: 'group',
                    index: 'group',
                    width: width * 0.10
                },
                {
                    name: 'app',
                    index: 'app',
                    width: width * 0.20
                },
                {
                    name: 'lastdata',
                    index: 'lastdata',
                    width: width * 0.25
                },
                {
                    name: 'delayedby',
                    index: 'delayedby',
                    width: width * 0.20
                    //cellattr: function(rowId, tv, rawObject, cm, rdata) {
                        //console.log('style="font-size:' + parseInt(coeffScale * 20) + 'px"');
                        //var cell = $(this).jqGrid('getCell', rowId, cm['name']);
                        //self.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', parseInt(coeffScale * 20) + 'px');
                        //return 'style=\"font-size:' + parseInt(coeffScale * 20) + 'px\"'; 
                    //}
                    //formatter: 'date',
                    //formatoptions: {newformat: 'd-M-Y, H:i:s'},
                    //datefmt: 'd-M-Y, H:i:s'
                }
            ]

            return colModel;
        },
        setCss: function(model) {
            var scale = this.grid.getScale();
            var unitHeight = this.grid.getUnitSizes().height;
            var unitWidth = this.grid.getUnitSizes().width;
            var dx = model.get('size')[0];
            var dy = model.get('size')[1];
            var px = model.get('coords')[0];
            var py = model.get('coords')[1];
            
            var sizeCoeff = this.board.settings['sizecoeff'] / 2;
            var coeffScale = scale * sizeCoeff;

            var totalHeight = dy * unitHeight * scale;
            var hscale = totalHeight / $(window).height(); //scale font for header

            this.container.css('width', dx * unitHeight * scale + 'px');
            this.container.css('height', dy * unitWidth * scale + 'px');

            var gboxHeight = this.container.find("#gbox_" + name).height() - this.container.find('#gbox_' + name + ' .ui-jqgrid-bdiv').height() + 2 * this.container.find('.ui-jqgrid .ui-jqgrid-pager').height();
            this.container.find('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow-x', 'hidden');
            this.prevGboxHeight = gboxHeight;

            var finalGridHeight = this.container.height() - gboxHeight - 2;
            var finalGridWidth = this.container.width() - 1;

            this.jqgridHTML.jqGrid('setGridHeight', finalGridHeight);
            this.jqgridHTML.jqGrid('setGridWidth', finalGridWidth, true);

            this.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', parseInt(coeffScale * 20) + 'px');


        },
        render: function() {
            var self = this;
            var colNames = this.model.get('colnames');
            var scale = this.grid.getScale();
            var sizeCoeff = this.board.settings['sizecoeff'] / 2;
            var coeffScale = scale * sizeCoeff;
            
            this.container = $(_.template(TableTemplate, {
                canberemoved: this.model.get('canberemoved'),
                id: this.model.get('id'),
                table_id: 'table_' + this.model.get('id'),
                pager_id: 'pager_' + this.model.get('id')
            }));

            /*SETTING DATA COLS/ROWS */
            var colModel = this.formHeaders();

            this.grid.addUnit(this.container, {
                border: 0,
                transparent: true
                //draggable: model.get('isdraggable'),
                //resizable: model.get('isresizable')
            }, this.model);

            /* INITIALIZE JQGRID */
            this.jqgridHTML = this.container.find('table');

            var dataToTable = this.model.collection.toJSON();

            this.jqgridElem = this.jqgridHTML.jqGrid({
                datatype: 'local',
                data: dataToTable,
                colNames: colNames,
                //height: 'auto',
                //height: '400',
                //width: '400',
                height: '100%',
                width: '100%',
                shrinkToFit: true,
                autowidth: true,
                hidegrid: false,
                colModel: colModel,
                scrollOffset: 0,
                pager: '#' + 'pager_' + this.model.get('id'),
                //rowNum: cols,
                caption: this.model.get('name'),
                afterShowSearch: function() {
                    self.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', coeffScale * 20 + 'px');
                    console.log('SEARCH');
                },
                afterRedraw: function() {
                    self.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', coeffScale * 20 + 'px');
                    console.log('SEARCH');
                },
                gridComplete: function() {
                    self.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', coeffScale * 20 + 'px');
                    console.log('SEARCH');
                }
            });

            this.jqgridHTML.jqGrid('filterToolbar', {stringResult: true, searchOnEnter: true});

            //this.formLookupTable();

            this.setCss(this.model);

            //this.setUpdateInterval();
        },
        reloadView: function() {
            this.container.find('table').trigger('reloadGrid');
        },
        onchangevalue: function(model) {
        },
        onchangevalcolor: function(model) {
            var id = model.get('id');
            var lookupObj = this.lookuptable[id];
            
        }
    });

    return AlarmListView;
});