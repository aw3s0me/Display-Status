define(['jquery', 'constructors/widgetFactory', 'controllers/tabController', 'controllers/datasourceController'], function($, WidgetFactory, TabController, DatasourceController) {
    var instance = null;

    function widgetController() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    widgetController.prototype = {
        sizeDetector: undefined,
        board: undefined,
        sizecoeff: undefined,
        views: {},
        sensors: {},
        sensorViewLookup: {},
        updSensorsInterval: undefined,
        construct: function() {
            var types = WidgetFactory.getWidgetTypes();
            var self = this;
            $.each(types, function(index, type) {
                self.views[type] = {};
            });

        },
        initializeBoard: function(board, attr) {
            this.board = board;
            this.sizecoeff = board.settings.sizecoeff;
            WidgetFactory.initializeFactory(this);
            WidgetFactory.createAllWidgets(attr);
        },
        getViewsObj: function(type) {
            return this.views[type];
        },
        viewsObjLength: function(type) {
            return Object.keys(this.views[type]).length;
        },
        getGrid: function(attr) {
            var grid;
            if (!attr._tabId) {
                return this.board.grid;
            }
            var tab = TabController.getTab(attr._tabId);
            if (tab)
                return tab.grid;
            return this.board.grid;
        },
        isSensorExists: function(id) {
            return this.sensors[id];
        },
        addViewToLookup: function(type, element) {
            this.views[type] = element;
        },
        addSensorToLookup: function(element) {
            this.sensors[element.get('id')] = element;
        },
        addSensorToTypeViewLookup: function(type, id, viewId) {
            this.sensorViewLookup[id] = {
                type: type,
                viewId: viewId
            }
        },
        removeSensorFromLookup: function(id) {
            if (this.sensors[id]) {
                delete this.sensors[id];
                return true;
            }
            else {
                return false;
            }
        },
        removeViewByType: function(type, id) {
            if (this.views[type] && this.views[type][id])
                delete this.views[type][id];
        },
        updateAllSensors: function() {
            var self = this;

            if (DatasourceController.isManyDatasources()){ //if multiple datasources
                $.each(DatasourceController.datasources, function(name, datasource) {
                    self.updateSensorsFromDatasource(datasource);
                });
            }
            else {
                var datasource = DatasourceController.getDefaultDatasource();
                this.updateSensorsFromDatasource({
                    dbname: datasource['dbname'],
                    dbgroup: datasource['dbgroup'],
                    server: datasource['server']
                });
            }
        },
        disableFetchingData: function() {
            this.updSensorsInterval = null;
        },
        enableFetchingData: function() {
            var self = this;
            this.updSensorsInterval = setInterval(function() {
                self.updateAllSensors();
            }, 2000); //the only way to pass param */
        },
        updateSensorsFromDatasource: function(datasource) {
            var dbname = datasource['dbname'];
            var dbgroup = datasource['dbgroup'];
            var server = datasource['server'];
            var result = undefined;
            var self = this;
            var source = datasource.sensors? datasource.sensors : this.sensors;

            var masks = [];

            for (var sensId in source) {
                var element = this.sensors[sensId];
                masks.push(element.get('mask'));
            }
            var masksToRequest = masks.join();
    
            try {
                //http://katrin.kit.edu/adei/services/getdata.php?db_server=fpd&db_name=katrin_rep&db_group=0&db_mask=102,106,107,108,149,150,103,109,110,111,151,152,74,66,68,99,12,67,69,100,2,3,4,5,6,7,8,9,59,61,75,78,80,82,145,112,113,116,117,118,146,119,120,123,124,125,186,187,188,190,191,192,190,191,192&window=-1
                var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=-1';
                //console.log(url);
                //window.db.httpGetCsv(url, function(data) {
                getDataFromAdei(url, true, function(data) {

                    result = parseCSVForUpdating(data, masks.length);
                    //console.log(result);
                    if (typeof(result) === "string") { //if res is not object
                        console.log('Error occured: ' + result);
                        var lastUpdatedTime = 'Error in getting data';
                        self.eventAggregator.trigger('loadingfinished', {
                            lastUpdatedTime: lastUpdatedTime
                        });
                        return;
                    }
                    var time = moment(result.time[0] * 1000);
                    var lastUpdatedTime = time.format('ddd MMM D YYYY HH:mm:ss') + ' GMT' + time.format('Z') + ', ' + time.fromNow();
                    //$('#lblFromNow').text();
                    self.board.eventAggregator.trigger('loadingfinished', {
                        lastUpdatedTime: lastUpdatedTime
                    });
                    //console.log(result)
                    var index = 0;
                    for (var sensId in source) {
                        var element = self.sensors[sensId];
                        element.updateModel(result.values[index++], time.valueOf());
                    }
                });
            } catch (msg) {
                alert(msg);
            }

        },
    };

    widgetController.getInstance = function() {
        if (instance === null) {
            instance = new widgetController();
        }

        return instance;
    }

    return widgetController.getInstance();
});