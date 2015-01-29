define(['jquery', 'constructors/widgetFactory', 'controllers/tabController', 'controllers/datasourceController'], function($, WidgetFactory, TabController, DatasourceController) {
    var instance = null;
    var _updateTime = 3000;

    function widgetController() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    function updateElapse(updateTimestamp) {
        var now = new Date();
        var elapse = Math.floor(now.getTime()/1000) - updateTimestamp;
        //if (Math.floor(elapse) < 0)
            //elapse = -elapse;
        if (updateTimestamp > 0) {
            return '' + Math.floor(elapse > 0? elapse: -elapse) + '~' + Math.floor(elapse + Math.floor(_updateTime/1000)) + ' sec ago';
        }

        return elapse;
    }

    function avgElapse(updateTimestamp){
        var now = new Date();
        var elapse = Math.floor(now.getTime()/1000) - updateTimestamp;
        return Math.floor(((elapse > 0? elapse: -elapse) + (elapse + Math.floor(_updateTime/1000)))/2);
    }

    function getRandomValue() {
        return Math.floor((Math.random()* 10 ) + 1) + Math.random();
    }

    widgetController.prototype = {
        sizeDetector: undefined,
        board: undefined,
        sizecoeff: undefined,
        views: {},
        sensors: {},
        sensorViewLookup: {},
        updSensorsInterval: undefined,
        issimulation: false,
        construct: function() {
            var types = WidgetFactory.getWidgetTypes();
            var self = this;
            $.each(types, function(index, type) {
                self.views[type] = {};
            });

        },
        initializeBoard: function(board, attr) {
            this.board = board;
            if (this.board.settings.issimulation) this.issimulation = true;
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
            }, 1000); //the only way to pass param */
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
                var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=-1';

                getDataFromAdei(url, true, function(data) {
                    result = parseCSVForUpdating(data, masks.length);
                    if (typeof(result) === "string") { //if res is not object
                        var lastUpdatedTime = 'Error in getting data';
                        self.eventAggregator.trigger('loadingfinished', {
                            lastUpdatedTime: lastUpdatedTime
                        });
                        throw new Error('Can\'t get latest data');
                    }
                    var time = moment();
                    var lastUpdatedTime = time.format('ddd MMM D YYYY HH:mm:ss') + ' GMT' + time.format('Z') + ', ' + updateElapse(result.time[0]);

                    self.board.eventAggregator.trigger('loadingfinished', {
                        lastUpdatedTime: lastUpdatedTime
                    });
                    var index = 0;
                    for (var sensId in source) {
                        var element = self.sensors[sensId];
                        element.updateModel(result.values[index++], result.time[0] * 1000);
                    }
                });
            } catch (msg) {
                throw new Error('Can\'t get latest data');
            }
        },
        simulateDataFetching: function () {
            var self = this;
            self.issimulation = true;
            //self.updateSimulation();

            self.initFirstLoading();

            this.updSensorsInterval = setInterval(function() {
                self.updateSimulation();
            }, 4000);
        },
        initFirstLoading: function () {
            var timeNow = moment();
            var sensors = this.sensors;

            for (var sensId in sensors) {
                var sensor = sensors[sensId];
                //sensor.updateModel(getRandomValue(), timeNow * 1000);
                sensor.updateModel(getRandomValue(), timeNow.valueOf());
                sensor.trigger('firstLoading');

            }

            this.updateTimeContainer(timeNow);
        },
        updateSimulation: function () {
            var sensors = this.sensors;
            var timeNow = moment();

            for (var sensId in sensors) {
                var sensor = sensors[sensId];
                //sensor.updateModel(getRandomValue(), timeNow * 1000);
                sensor.updateModel(getRandomValue(), timeNow.valueOf());
            }

            this.updateTimeContainer(timeNow);
        },
        updateTimeContainer: function(time) {
            var utc = time.valueOf();
            var lastUpdatedTime = time.format('ddd MMM D YYYY HH:mm:ss') + ' GMT' + time.format('Z') + ', ' + updateElapse(utc/1000);
            this.board.eventAggregator.trigger('loadingfinished', {
                lastUpdatedTime: lastUpdatedTime,
                format: 's',
                number: avgElapse(utc/1000)
            });
        }
    };

    widgetController.getInstance = function() {
        if (instance === null) {
            instance = new widgetController();
        }

        return instance;
    }

    return widgetController.getInstance();
});