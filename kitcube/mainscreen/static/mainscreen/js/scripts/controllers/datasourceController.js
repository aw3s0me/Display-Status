define(['jquery'], function($) {
    var instance = null;

    function datasourceController() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.construct();
    }

    datasourceController.prototype = {
        datasources: {},
        construct: function() {

        },
        initDatasources: function(datasourceObj) {
            window.host = datasourceObj.host;

            if (!this.isManyDatasources(datasourceObj)) { //if there just one datasource
                this.datasources['default'] = {
                    dbgroup : datasourceObj['dbgroup'],
                    dbname : datasourceObj['dbname'],
                    server : datasourceObj['server']
                }
                this.datasources['default'].sensors = {};
                this.datasources['default'].id = 'default';
                return;
            }

            for (var datasourceName in datasourceObj) {
                if (datasourceName === 'host') {
                    continue;
                }
                var datasource = datasourceObj[datasourceName];
                datasource['masks'] = [];
                datasource['sensors'] = {};
                if (!datasource['dbgroup'] || !datasource['dbname'] || !datasource['server']) {
                    alert('Please specify fields dbgroup, dbname and server in configuration file');
                }
                this.datasources[datasourceName] = datasource;
                this.datasources[datasourceName].id = datasourceName; //meta id
            }
        },
        getDatasourcesForModels: function(models) { //used in charts
            var datasources = {};
            if (!this.isManyDatasources()) {
                var datasource = this.datasources['default'];
                datasource.id = 'default';
                return datasource;
            }

            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                var datasourceName = model.get('datasource');
                if (!datasources[datasourceName])
                    datasources[datasourceName] = {};
                if (!datasources[datasourceName]['dbgroup'])
                    datasources[datasourceName]['dbgroup'] = this.settings.datasources[datasourceName]['dbgroup'];
                if (!datasources[datasourceName]['dbname'])
                    datasources[datasourceName]['dbname'] = this.settings.datasources[datasourceName]['dbname'];
                if (!datasources[datasourceName]['server'])
                    datasources[datasourceName]['server'] = this.settings.datasources[datasourceName]['server'];
                if (!datasources[datasourceName]['sensors'])
                    datasources[datasourceName]['sensors'] = {
                }

                datasources[datasourceName]['sensors'][model.get('id')] = model;
                //this.settings.datasources[datasourceName]
            }

            return datasources;
        },
        isManyDatasources: function(datasourceObj) {
            if (datasourceObj === undefined)
                datasourceObj = this.datasources['default'];
            return !(datasourceObj['dbgroup'] && datasourceObj['dbname'] && datasourceObj['server']);
        },
        addSensorToDatasource: function(datasource, id, model) {
            this.datasources[datasource].sensors[id] = model;
        },
    };

    datasourceController.getInstance = function() {
        if (instance === null) {
            instance = new datasourceController();
        }

        return instance;
    }

    return datasourceController.getInstance();
});