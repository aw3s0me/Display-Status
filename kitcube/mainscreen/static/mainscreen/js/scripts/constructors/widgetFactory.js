define(['jquery', 'dev/helpers/priorityqueue', 'views/widgets/chartView', 'views/widgets/alarmListView', 'views/widgets/sensorGroupView', 'views/widgets/sensorJqGridTableView', 'views/widgets/sensorCustomTableView', 'views/widgets/trendSensorView', 'views/pres/tabView', 'views/widgets/alarmListViewKitcube', 'views/widgets/webCamView', 'controllers/tabController', 'controllers/datasourceController', 'views/widgets/heatmapView'], function($, PriorityQueue, ChartView, AlarmListView, SensorGroupView, SensorJqGridTableView, SensorCustomTableView, TrendSensorView, TabView, KitcubeAlarm, WebCamView, TabController, DatasourceController, HeatmapView) {

    var instance = null;
    var priorities = { //[type -> priority]
        'sensor': 3,
        'sensortable': 3,
        'sensorgroup': 3,
        'alarmlist': 2,
        'alarms_kitcube': 2,
        'webcam': 2,
        'heatmap': 1,
        'chart': 1
    };

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
                if (elObj["type"] === "chart" && !DatasourceController.isAxesInitialized && !this.widgetController.issimulation) {
                    console.log('GETAXES', this.widgetController.issimulation);
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
            attr.wc = this.widgetController;
            attr.dc = DatasourceController;
            switch (attr["type"]) {
                case "sensor":
                    //222
                    break;
                case "sensortable":
                    void(new SensorJqGridTableView(attr));
                    break;
                case "sensorgroup":
                    void(new SensorGroupView(attr));
                    break;
                case "alarmlist":
                    void(new AlarmListView(attr));
                    break;
                case "alarms_kitcube":
                    void(new KitcubeAlarm(attr));
                    break;
                case "chart":
                    void(new ChartView(attr));
                    break;
                case "webcam":
                    void(new WebCamView(attr));
                    break;
                case "heatmap":
                    void(new HeatmapView(attr));
                    break;
                default:
                    break;
            }
        }
    };

    widgetFactory.getInstance = function() {
        if (instance === null) {
            instance = new widgetFactory();
        }

        return instance;
    }

    return widgetFactory.getInstance();
});