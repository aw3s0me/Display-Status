define(['jquery', 'dev/helpers/priorityqueue', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'models/sensorGroupModel', 'models/alarmListModel', 'views/widgets/singleSensorView', 'views/widgets/doubleSensorView', 'views/widgets/emptySensorView', 'views/widgets/chartView', 'views/widgets/alarmListView', 'views/widgets/sensorGroupView', 'collections/sensorCollection', 'models/sensorTableModel', 'views/widgets/sensorJqGridTableView', 'views/widgets/sensorCustomTableView', 'views/widgets/trendSensorView', 'models/trendSensorModel', 'views/pres/tabView', 'views/widgets/alarmListViewKitcube', 'views/widgets/webCamView', 'controllers/tabController', 'controllers/datasourceController'], function($, PriorityQueue, Sensor, Alarm, MyAlarmCollection, Chart, SensorGroupModel, AlarmListModel, SingleSensorView, DoubleSensorView, EmptySensorView, ChartView, AlarmListView, SensorGroupView, SensorCollection, SensorTableModel, SensorJqGridTableView, SensorCustomTableView, TrendSensorView, TrendSensorModel, TabView, KitcubeAlarm, WebCamView, TabController, DatasourceController) {

    var instance = null;
    var priorities = { //[type -> priority]
        'sensor': 3,
        'sensortable': 3,
        'sensorgroup': 3,
        'alarmlist': 2,
        'alarms_kitcube': 2,
        'webcam': 2,
        'chart': 1
    }

    function widgetFactory() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    widgetFactory.prototype = {
        sizeDetector: undefined,
        queue: undefined,
        construct: function() {

        },
        getWidgetTypes: function() {

        },
        createAllWidgets: function(attr) {
            var queue = new PriorityQueue(function(a, b) {
                return a.priority - b.priority;
            });

            for (var _elId in attr) {
                var elObj = attr[_elId];
                var tabId = TabController.tabOfElementIndex(_elId);
                console.log(tabId);
                elObj._id = _elId;
                if (tabId) {
                    elObj._tabId = tabId;
                }
                queue.enq({
                    priority: priorities[elObj["type"]],
                    attrs: elObj
                });
            }
            while (queue.size() > 0)
                console.log(queue.deq().attrs['type']);

        },
        addWidget: function(attr) {
            switch (elObj["type"]) {
                case "sensor":

                    break;
                case "sensortable":

                    break;
                case "sensorgroup":
                    this.addSensorGroup(attr);
                    break;
                case "alarmlist":
                    break;
                case "alarms_kitcube":

                    break;
                case "chart":
                    //this.addChart(attr);
                    break;
                case "webcam":

                    break;
                default:
                    break;
            }
        },
        addSensorGroup: function(attr) {
            var sensorArr = attr['sensors'];
            var trendsArr = [];
            var group = [];
            var sensorModelsArr = [];
            var emptyCount = attr['empties'];
            //which tab will be there
            var grid = WidgetController.getGrid(attr);
            var size = undefined;

            //if groups are not from diff sources
            size = [WidgetController.sizecoeff, WidgetController.sizecoeff];

            for (var i = 0; i < sensorArr.length; i++) {
                var sensorObj = sensorArr[i];

                if (!size)
                    size = sensorObj["size"];

                var newSensor = new Sensor({
                    id: sensorObj["id"],
                    name: sensorObj["name"],
                    comment: sensorObj["comment"],
                    sensortype: sensorObj["sensortype"],
                    link: sensorObj["link"],
                    sensorviewtype: "group",
                    unit: sensorObj["unit"],
                    max: sensorObj["max"],
                    min: sensorObj["min"],
                    precision: sensorObj["precision"],
                    exp: sensorObj["exp"],
                    datasource: sensorObj['datasource']? sensorObj['datasource'] : 'default',
                    device: sensorObj["device"],
                    norender: sensorObj["norender"],
                    mask: sensorObj["mask"],
                    size: size,
                    coords: sensorObj["coords"],
                    values: new Array(),
                    lastTime: new Date,
                    factor: sensorObj["factor"],
                    cfgObj: sensorObj
                });

                if (this.settings.datasources)
                    DatasourceController.addSensorToDatasource(newSensor.get('datasource'), sensorObj['id'], newSensor);

                if (this.sensors[sensorObj["id"]]) {
                    throw "This sensor already exists" + sensorObj["id"];
                }

                this.sensors[sensorObj["id"]] = newSensor;

                newSensor.on('removing', function() {
                    if (this.sensors)
                        delete this.sensors[newSensor.get('id')];
                }, this);

                sensorModelsArr.push(newSensor);
            }

            for (var sensorName in sensorModelsArr) {
                var sensor = sensorModelsArr[sensorName];
                var linkModel = undefined;
                var newSensorView;

                if (sensor.get('link') !== undefined) {
                    linkModel = this.sensors[sensor.get('link')];
                    if (!linkModel) {
                        throw "Wrong link: " + sensor.get('link') + " at: " + sensor.get('id');
                    }
                    newSensorView = new DoubleSensorView({
                        model: sensor,
                        grid: this.grid,
                        group: false,
                        linkModel: linkModel
                    });

                    this.sensorViewLookup[linkModel.get('id')] = {
                        type: 2,
                        viewId: sensor.get('id')
                    }
                    this.sensorViewLookup[sensor.get('id')] = {
                        type: 1,
                        viewId: sensor.get('id')
                    };
                } else {
                    newSensorView = new SingleSensorView({
                        model: sensor,
                        grid: grid,
                        group: false,
                        linkModel: linkModel
                    });

                    if (!sensor.get('norender')) {
                        this.sensorViewLookup[sensor.get('id')] = {
                            type: 0,
                            viewId: sensor.get('id')
                        }
                    }
                }

                if (!sensor.get('norender')) {
                    //self.views.sensors[sensor.get('id')] = newSensorView;
                    group[sensor.get('id')] = newSensorView;
                }
            }

            var newSensorGroupModel = new SensorGroupModel({
                id: attr._id,
                name: attr['name'],
                size: attr['size'],
                coords: attr['coords'],
                diffsensors: attr['diffsensors'],
                collection: new SensorCollection(sensorModelsArr),
                cfgObj: attr,
                groupname1: attr["groupname1"],
                groupname2: attr["groupname2"],
                order: attr['order'],
                empties: attr['empties']
            });

            var newSensorGroupView = new SensorGroupView({
                model: newSensorGroupModel,
                grid: grid,
                group: group,
                sizecoeff: this.settings['sizecoeff']
            });

            this.views.sensorgroups[attr._id] = newSensorGroupView;
            newSensorGroupView.on('removing', function() {
                //delete this.elements.sensorgroups[attr._id];
                if (this.views) {
                    delete this.views.sensorgroups[attr._id];
                }

            }, this);

            this.elements.sensorgroups[attr._id] = newSensorGroupModel;
        /*,
        addChart: function(attr) {
            //which tab will be there
            var grid = this.getGrid(attr);

            var newChart = new Chart({
                id: attr._id,
                caption: attr["caption"],
                charttype: attr["charttype"],
                type: attr["type"],
                link: attr["link"],
                legend: attr["legend"],
                linewidth: attr["width"],
                size: attr["size"],

                coords: attr["coords"],
                puredata: {},
                range: attr["startrange"],
                scale: grid.getScale(),
                cfgObj: attr,
                axislabels: attr['axislabels'],
                resolution: attr['resolution']
            });

            var newChartView = new ChartView({
                model: newChart,
                grid: grid,
                allSensors: this.sensors,
                board: this
            });

            newChart.on('removing', function() {
                if (this.elements) {
                    delete this.elements.charts[attr._id];
                    delete this.views.charts[attr._id];
                }
            }, this);

            this.elements.charts[attr._id] = newChart;
            this.views.charts[attr._id] = newChartView;
        },
        
        }*/
    };

    widgetFactory.getInstance = function() {
        if (instance === null) {
            instance = new widgetFactory();
        }

        return instance;
    }

    return widgetFactory.getInstance();
});