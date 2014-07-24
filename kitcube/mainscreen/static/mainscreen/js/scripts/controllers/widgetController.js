define(['jquery', 'constructors/widgetFactory', 'controllers/tabController'], function($, WidgetFactory, TabController) {
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
        construct: function() {

        },
        initializeBoard: function(board, attr) {
            this.board = board;
            this.sizecoeff = board.settings.sizecoeff;
            WidgetFactory.createAllWidgets(attr);
        },
        getGrid: function(attr) {
            var grid;
            if (!attr._tabId) {
                return this.board.grid;
            }
            var tab = TabController.getTab(attr._tabId);
            //var tab = this.views.tabs[attr._tabId];
            if (tab)
                return tab.grid;
            return this.board.grid;
        },
        addViewToLookup: function(type, element) {
            this.views['type']
        },
        addSensorToLookup: function(element) {

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