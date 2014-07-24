define(['jquery', 'constructors/widgetFactory'], function($, WidgetFactory) {
    var instance = null;

    function widgetController() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    widgetController.prototype = {
        sizeDetector: undefined,
        construct: function() {

        },
        initializeBoard: function(attr) {
            WidgetFactory.createAllWidgets(attr);
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