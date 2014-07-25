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
        widgetController: undefined,
        construct: function() {

        },
        initializeFactory: function(widgetController) {
            this.widgetController = widgetController;
        },
        getWidgetTypes: function() {
            return Object.keys(priorities);
        },
        createAllWidgets: function(attr) {
            var queue = new PriorityQueue(function(a, b) {
                return a.priority - b.priority;
            });

            for (var _elId in attr) {
                var elObj = attr[_elId];
                var tabId = TabController.tabOfElementIndex(_elId);
                elObj._id = _elId;
                if (tabId) {
                    elObj._tabId = tabId;
                }
                if (elObj["type"] === "chart" && !DatasourceController.isAxesInitialized) {
                    DatasourceController.getAxes();
                }
                queue.enq({
                    priority: priorities[elObj["type"]],
                    obj: elObj
                });
            }
            while (queue.size() > 0)
                this.addWidget(queue.deq().obj);

        },
        addWidget: function(attr) {
            switch (attr["type"]) {
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
                    this.addKitcubeAlarmList(attr);
                    break;
                case "chart":
                    this.addChart(attr);
                    break;
                case "webcam":
                    this.addWebCam(attr);
                    break;
                default:
                    break;
            }
        },
        addSensorGroup: function(attr) {
            var WidgetController = this.widgetController;
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

                DatasourceController.addSensorToDatasource(newSensor.get('datasource'), sensorObj['id'], newSensor);

                if (WidgetController.isSensorExists(sensorObj["id"])) {
                    throw "This sensor already exists" + sensorObj["id"];
                }

                WidgetController.addSensorToLookup(newSensor);

                newSensor.on('removing', function() {
                    WidgetController.removeSensorFromLookup(newSensor.get('id'));
                }, this);

                sensorModelsArr.push(newSensor);
            }

            for (var sensorName in sensorModelsArr) {
                var sensor = sensorModelsArr[sensorName];
                var linkModel = undefined;
                var newSensorView;

                newSensorView = new SingleSensorView({
                    model: sensor,
                    grid: grid,
                    group: false,
                    linkModel: linkModel
                });
              
                if (sensor.get('link') !== undefined) {
                    linkModel = WidgetController.sensors[sensor.get('link')];
                    if (!linkModel) {
                        throw "Wrong link: " + sensor.get('link') + " at: " + sensor.get('id');
                    }
                    newSensorView = new DoubleSensorView({
                        model: sensor,
                        grid: grid,
                        group: false,
                        linkModel: linkModel
                    });

                    WidgetController.addSensorToTypeViewLookup(1, sensor.get('id'), sensor.get('id'));
                    WidgetController.addSensorToTypeViewLookup(2, linkModel.get('id'), sensor.get('id'));
                } else {
                    newSensorView = new SingleSensorView({
                        model: sensor,
                        grid: grid,
                        group: false,
                        linkModel: linkModel
                    });

                    if (!sensor.get('norender')) {
                        WidgetController.addSensorToTypeViewLookup(0, sensor.get('id'), sensor.get('id'));
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
                sizecoeff: WidgetController.sizecoeff
            });

            WidgetController.addViewToLookup(newSensorGroupModel.get('type'), newSensorView);
            //this.views.sensorgroups[attr._id] = newSensorGroupView;

            newSensorGroupView.on('removing', function() {
                WidgetController.removeViewByType(newSensorGroupModel.get('type'), newSensorGroupModel.get('id'));
            }, this);
        },
        addChart: function(attr) {
            //which tab will be there
            var grid = this.widgetController.getGrid(attr);

            var newChart = new Chart({
                id: attr._id,
                caption: attr["caption"],
                charttype: attr["charttype"],
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
                allSensors: this.widgetController.sensors,
                board: this.widgetController.board
            });

            newChart.on('removing', function() {
                this.widgetController.removeViewByType(newChart.get('type'), newChart.get('id'));
            }, this);

            //this.elements.charts[attr._id] = newChart;
            //this.views.charts[attr._id] = newChartView;
            this.widgetController.addViewToLookup(newChart.get('type'), newChartView);
        },
        addWebCam: function(attr) {
            attr.id = attr._id;
            attr.board = this.widgetController.board;
            attr.grid = this.widgetController.getGrid(attr);
            var webCam = new WebCamView(attr);
            this.widgetController.addViewToLookup(attr['type'], webCam);
        },
        addAlarmList: function(attr) {
            var alarmList = []; //collection of alarms
            var newAlarmCollection = undefined;
            var dbname = undefined;
            var server = undefined;
            var control_group = attr['control_group'] ? attr['control_group'] : undefined;
            //which tab will be there
            var grid = this.widgetController.getGrid(attr);

            if (attr['masks'] && (attr['masks'] instanceof Array)) {
                for (var alarmKey in attr['masks']) { //going from alarmlist object through elems
                    //console.log(alarmKey);
                    if (!$.isNumeric(alarmKey)) {
                        var alarmAttr = attr['masks'][alarmKey];
                        var newAlarm = new Alarm({
                            id: alarmKey,
                            module: alarmAttr["module"],
                            group: alarmAttr["group"],
                            app: alarmAttr["app"],
                            dbname: alarmAttr["dbname"],
                            mask: alarmAttr["mask"],
                            cfgObj: alarmAttr
                        });
                    } else {
                        var newAlarm = new Alarm({
                            id: "alarm_" + alarmKey,
                            mask: alarmAttr["mask"]
                        });
                    }

                    alarmList.push(newAlarm); //push to collection
                };
                newAlarmCollection = new MyAlarmCollection(alarmList);
            }

            var newAlarmListModel = new AlarmListModel({
                id: attr._id,
                collection: newAlarmCollection,
                size: attr['size'],
                name: attr['name'],
                coords: attr['coords'],
                target: attr['target'] ? attr['target'] : "all",
                server: server,
                dbname: dbname,
                control_group: control_group,
                cfgObj: attr
            });

            //console.log(newAlarmCollection.id);
            //this.elements.alarms[attr._id] = newAlarmListModel;
            var newAlarmListView = new AlarmListView({
                model: newAlarmListModel,
                grid: grid,
                board: this.widgetController.board
            });
            this.widgetController.addViewToLookup(newAlarmListModel.get('type'), newAlarmListView);
        },
        addKitcubeAlarmList: function(attr) {
            attr.id = attr._id;
            attr.board = this.widgetController.board;
            attr.grid = this.widgetController.getGrid(attr);
            var alarm = new KitcubeAlarm(attr);
            this.widgetController.addViewToLookup(attr['type'], alarm);
        }
    }

    widgetFactory.getInstance = function() {
        if (instance === null) {
            instance = new widgetFactory();
        }

        return instance;
    }

    return widgetFactory.getInstance();
});