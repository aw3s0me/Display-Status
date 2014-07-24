define(['jquery', 'jqueryui', 'views/pres/tabView'], function($, ui, TabView) {
    var instance = null;

    function tabController() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    tabController.prototype = {
        tabsDict: {},
        tabViewLookup: {},
        sizeDetector: undefined,
        construct: function() {
            this.container = $('#tabs');
            this.isInitialized = false;
        },
        initializeTabs: function(attr, sizeDetector, isPortrait) {
            if (this.isInitialized || !sizeDetector)
                return false;
            this.sizeDetector = sizeDetector;
            this.container = $('#tabs');

            this.container.append('<ul></ul>');
            
            for (var tabId in attr) {
                var tabAttr = attr[tabId];
                var links = tabAttr['content'];
                var newTabProperties = {
                    name: tabAttr['name'],
                    id: tabId,
                    can_close: true,
                    links: links,
                    container: $('#tabs')
                }
                var newTabView = new TabView(newTabProperties);
                this.setTabCss(newTabView.el);

                this.tabsDict[tabId] = newTabView;
                // initialize tab lookup dictionary
                for (var i = 0; i < links.length; i++) {
                    this.tabViewLookup[links[i]] = tabId;
                }

                newTabView.initializeGrid(tabId);
            }

            $('#tabs li').css('height', 40 * this.sizeDetector.scale)
                .css('font-size', 24 * this.sizeDetector.scale);

            $('#tabs').tabs({
                collapsible: false
            });

            $('#footer').css('position', 'absolute');

            var self = this;
            $('#toggleGridButton').click(function(e) {
                console.log('toggle: ')
                var id = self.getCurrentTab();
                console.log(id);
                var tab = self.getTab(id);
                tab.grid.toggleGrid();
            }).tooltip({});

            this.setCss({
                portrait: isPortrait
            });

            this.isInitialized = true;
        },
        getTab: function(id) {
            return this.tabsDict[id] || false;
        },
        getCurrentTab: function() {
            var activeTabIdx = this.container.tabs('option', 'active');
            var activeTabID = $('#tabs > ul > li').eq(activeTabIdx).attr('aria-controls');
            return activeTabID;
        },
        tabOfElement: function(elemId) {
            var tabId = this.tabViewLookup[elemId]
            var tab = this.getTab(elemId);
            return tab;
        },
        tabOfElementIndex: function(elemId) {
            return this.tabViewLookup[elemId];
        },
        setTabCss: function(canvas) {
            canvas.css('height', this.sizeDetector.boardSizePx.height + 'px')
                .css('width', this.sizeDetector.boardSizePx.width + 'px')
                .data('height', this.sizeDetector.boardSizePx.height)
                .data('width', this.sizeDetector.boardSizePx.width)
                .data('gridUnitX', this.sizeDetector.unitSize)
                .data('gridUnitY', this.sizeDetector.unitSize)
                .data('gridSizeX', this.sizeDetector.gridSize.width)
                .data('gridSizeY', this.sizeDetector.gridSize.height)
                .data('scale', this.sizeDetector.scale)
                .data('scaledUnitSize', this.sizeDetector.scaledUnitSize);
        },
        setCss: function(options) {
            if (!options || !options.portrait) {
                if ($('#tabs').width() < $('#wrapper').width()) {
                    $('#wrapper').css('overflow-x', 'hidden');
                    $('#footer').css('bottom', '0');
                }
            }
            else if (options && options.portrait) {
                if ($('#tabs').width() < $('#wrapper').width()) {
                    console.log('HIDE SCROLL')
                    $('#wrapper').css('overflow-x', 'hidden');
                    $('#footer').css('bottom', '0');
                }

                $('#tabs').css('width', this.sizeDetector.boardSizePx.width + 8 + 'px');
                if ($('#tabs').height() < $('#wrapper').height() - 60) { //50 size of banner
                    $('#wrapper').css('overflow-y', 'scroll');
                }

            }
        }
    };

    tabController.getInstance = function() {
        if (instance === null) {
            instance = new tabController();
        }

        return instance;
    }

    return tabController.getInstance();
});