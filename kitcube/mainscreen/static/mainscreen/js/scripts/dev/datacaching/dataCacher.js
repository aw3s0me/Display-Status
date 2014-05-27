var dataCacher = function(communicationType, isCache, isCacheDown, isCacheUp, isCacheCurrent)
{
    var me = {};

    me.dataHandl = new dataHandler(communicationType);
    me.dateHelper = new dateTimeFormat();
    me.communicationType = communicationType;
    me.isCache = isCache;
    me.isCacheDown = isCacheDown;
    me.isCacheUp = isCacheUp;
    me.isCacheCurrent = isCacheCurrent;

    me.HostURL = 'http://katrin.kit.edu/adei';

    me.db = '';
    me.clientsCallback = '';
    me.level = '';
    me.columns = '';
    me.tableName = '';
    me.labels = [];
    me.db_items = [];
    me.aggregation = '';
    me.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if (me.isFirefox)
    {
        me.isCache = false;
        me.isCacheDown = false;
        me.isCacheUp = false;
        me.isCacheCurrent = false;
    }
    me.getData = function(db_server,
            db_name,            
            db_group,
            db_mask,
            window,
            pointCount,
            aggregation,
            onEndCallBack)
    {
        var self = this;
        var db_items = db_mask.split(',');
        db_items.sort();
        self.dataHandl.deleteWorkers();
        self.clientsCallback = onEndCallBack;
        self.aggregation = aggregation;
        if (self.dataHandl.isPriviousRequest())
        {
            if (db_mask != 'all')
            {
                self.db_items = db_items;
            }
            else
            {
                self.db_items = self.dataHandl.getDbMask();
            }
            self.dataHandl.setRequest(window, pointCount);
            self.level = self.dataHandl.level;
            self.columns = self.formTableColumns();
            self.tableName = self.formTableName(self.level.window);
            self.onReadyFormingRequest();
        }
        else
        {
            if (!self.isFirefox)
            {
                self.db.transaction(function(req)
                {
                    var sql = 'SELECT * FROM DataSource WHERE ((db_server="' + db_server + '") AND (db_name="' + db_name + '")) AND ((db_group="' + db_group + '") AND (aggregation="' + aggregation + '")) AND (db_items="' + db_items + '")';
                    req.executeSql(sql, [], function(req, results)
                    {
                        if (results.rows.length == 0)
                        {
                            if (db_mask != 'all')
                            {
                                self.db_items = db_items;
                                //db_mask = self.formDbMask(db_server, db_name, db_group);
                                db_mask = self.db_items;
                            }
                            else
                            {
                                db_mask = self.formDbMask(db_server, db_name, db_group);
                                self.db_items = db_mask;
                            }
                            var dataLevels = self.formDataLevels(db_server, db_name, db_group);
                            self.dataHandl.setDataLevels(dataLevels.reverse());
                            self.dataHandl.setAggregation(aggregation);
                            self.dataHandl.setNewRequest(db_server, db_name, db_group, db_mask, window, pointCount);
                            self.level = self.dataHandl.level;
                            self.columns = self.formTableColumns();
                            self.dataHandl.setLabels(self.formLabels());
                            self.tableName = self.formTableName(self.level.window);

                            self.onReadyFormingRequest();
                        }
                        else
                        {
                            if (db_mask != 'all')
                            {
                                self.db_items = db_mask.split(',');
                                db_mask = results.rows.item(0).db_items.split(',');
                            }
                            else
                            {
                                db_mask = results.rows.item(0).db_items.split(',');
                                self.db_items = db_mask;
                            }
                            self.dataHandl.setDataLevels(results.rows.item(0).datalevels.split(','));
                            self.dataHandl.setAggregation(results.rows.item(0).aggregation);
                            self.dataHandl.setNewRequest(db_server, db_name, db_group, db_mask, window, pointCount);
                            self.dataHandl.setLabels(results.rows.item(0).labels.split(','));
                            self.columns = self.formTableColumns();
                            self.level = self.dataHandl.level;
                            self.tableName = self.formTableName(self.level.window);

                            self.onReadyFormingRequest();
                        }
                    }, self.onErrorSql.bind(self));
                });
            }
            else
            {
                if (db_mask != 'all')
                {
                    self.db_items = db_items;
                    //db_mask = self.formDbMask(db_server, db_name, db_group);
                    db_mask = self.db_items;
                }
                else
                {
                    db_mask = self.formDbMask(db_server, db_name, db_group);
                    self.db_items = db_mask;
                }
                var dataLevels = self.formDataLevels(db_server, db_name, db_group);
                self.dataHandl.setDataLevels(dataLevels.reverse());
                self.dataHandl.setAggregation(aggregation);
                self.dataHandl.setNewRequest(db_server, db_name, db_group, db_mask, window, pointCount);
                self.level = self.dataHandl.level;
                self.columns = self.formTableColumns();
                self.dataHandl.setLabels(self.formLabels());
                self.tableName = self.formTableName(self.level.window);

                self.onReadyFormingRequest();
            }
        }


        /*self.formDbMask(db_server, db_name, db_group);
         if (db_mask != 'all')
         {
         var db_items = db_mask.split(',');
         }
         var maxLevel = self.formMaxLevel(db_server, db_name, db_group);
         var dataLevels = self.formDataLevels(db_server, db_name, db_group);

         self.dataHandl.setChannelCount(self.db_mask.length);
         self.dataHandl.setMaxLevel(maxLevel);
         self.dataHandl.setDataLevels(dataLevels);
         self.dataHandl.setRequest(db_server, db_name, db_group, db_items, window, pointCount);

         self.level = self.dataHandl.level;
         self.tableName = self.formTableName(self.level.window);
         self.columns = self.formTableColumns();
         self.clientsCallback = onEndCallBack;*/


    };

    me.onReadyFormingRequest = function()
    {
        var self = this;
        if (!self.isFirefox)
        {

            self.db.transaction(function(req)
            {
                var sqlStatement = self.formDataSourceStatement();
                req.executeSql(sqlStatement, [], function(req, results)
                {

                    if (results.rows.length == 0)
                    {
                        self.requestData(self.dataHandl.getWindow());
                    }
                    else
                    {
                        var idDataSource = results.rows.item(0).id;
                        var time = self.dateHelper.formatTime(self.dataHandl.getWindow());
                        var sqlStatement = 'SELECT * FROM "' + idDataSource + '" WHERE  (DateTime) <=  ' + parseInt(time.endTime) + ' AND (DateTime) >= ' + parseInt(time.begTime) + ' ORDER BY DateTime';
                        req.executeSql(sqlStatement, [], self.onReturnResult.bind(self));

                    }


                },
                        self.onErrorSql.bind(self));

            },
                    self.onError.bind(self),
                    self.onReadyTransaction);
        }
        else
        {
            self.requestData(self.dataHandl.getWindow());
        }
    };


    me.requestData = function(window)
    {
        var self = this;
        var time = self.dateHelper.formatTime(window);
        switch (self.communicationType)
        {
            case 'websockets':
                self.dataHandl.setReadingMode(true);
                self.webSocket.sendMessage(self.tableName + ';' + window + ';' + '1' + ';' + self.dataHandl.getAggregation() + ';' + self.dataHandl.getDbMask().length + ';' + self.dataHandl.formDbMask() + ';');
                break;
            case 'httpgetcsv':
                var url = self.formURLGetCsv(
                        self.dataHandl.getDbServer(),
                        self.dataHandl.getDbName(),
                        self.dataHandl.getDbGroup(),
                        self.dataHandl.formDbMask(),
                        time.begTime + '-' + time.endTime,
                        self.level.window);
                self.httpGetCsv(url, self.dataHandl.onMessageRecievedCsv.bind(self.dataHandl));
                break;
            case 'httpgetbinary':
                self.dataHandl.setReadingMode(true);
                var url = self.formURLGetBinary(
                        self.dataHandl.getDbServer(),
                        self.dataHandl.getDbName(),
                        self.dataHandl.getDbGroup(),
                        self.dataHandl.formDbMask(),
                        time.begTime + '-' + time.endTime,
                        self.level.window);
                self.httpGetBinary(url, self.dataHandl.onMessageRecievedBinary.bind(self.dataHandl));

                break;
        }

    };

    me.onReturnResult = function(req, res)
    {
        var self = this;
        if (!self.isFirefox)
        {
            if (res.rows.length !== 0)
            {
                var dataBuffer = [];
                var dateTime = [];
                var labels = [];
                self.dataHandl.concatRowData(res, dataBuffer, dateTime);
                labels = self.dataHandl.getLabels();

                if (self.isCache)
                {
                    self.startBackgroundCachers();
                }
                self.clientsCallback({data: dataBuffer, dateTime: dateTime, label: labels});
            }

            else
            {
                self.insertNeedenDataBckgr(self.dataHandl.getWindow());
            }
        }
        else
        {
        }
    };

    me.startBackgroundCachers = function()
    {
        var self = this;
        if (parseInt(self.level.window) != self.dataHandl.dataLevel[0] && self.isCacheUp === true)
        {
            var upDataLevel = self.dataHandl.getDataLevelForUp(self.level);
            var tableNameForUp = self.formTableName(upDataLevel.window);
            self.dataHandl.startBackgroundCaching(upDataLevel, self.columns, tableNameForUp);
        }
        if (parseInt(self.level.window) != 0 && self.isCacheDown === true)
        {
            var backgrDataLevel = self.dataHandl.getDataLevelForBackgr(self.level);
            var tableNameForBackgr = self.formTableName(backgrDataLevel.window);
            self.dataHandl.startBackgroundCaching(backgrDataLevel, self.columns, tableNameForBackgr);
        }
        if (self.isCacheCurrent === true)
        {
            var beginTime = parseFloat(self.dataHandl.getBeginTime());
            var endTime = parseFloat(self.dataHandl.getEndTime());
            var diffrence = endTime - beginTime;
            var needenLeftTime = beginTime - diffrence;
            var needenRightTime = endTime + diffrence;
            self.dataHandl.setBeginTime(needenLeftTime);
            self.dataHandl.setEndTime(needenRightTime);
            self.dataHandl.setWindow(needenLeftTime + '-' + needenRightTime);
            self.dataHandl.startBackgroundCaching(self.level, self.columns, self.tableName);
        }
    };

    me.insertNeedenDataBckgr = function(window)
    {
        var self = this;
        self.requestData(window);
    };

    me.splitData = function(objData)
    {
        var self = this;
        objData.label = self.dataHandl.getLabels();
        var clone = {};
        clone.data = [];
        clone.dateTime = objData.dateTime;
        clone.label = objData.label.slice(0);
        for (var i = 0; i < self.db_items.length; i++)
        {
            clone.data.push(objData.data[i].slice(0));
        }
        return clone;
    };


    me.onReadyFormingData = function(objData)
    {
        var self = this;
        if (objData.dateTime.length != 0)
        {
            if (objData.data[0].length < 10000)
            {
                if (!self.isFirefox)
                {
                    if (self.isCache)
                    {

                        self.dataHandl.startBackgroundCaching(self.level, self.columns, self.tableName);
                        self.startBackgroundCachers();
                    }
                }
                self.clientsCallback(objData);
            }
            else
            {
                self.clientsCallback(objData);
                console.log('Too much points in request.')
            }
        }
        else
        {
            self.clientsCallback(null);
            throw 'There is no data in server responces.';
        }

    };

    me.openDataBase = function(name)
    {
        if (this.db == '')
        {
            try
            {
                this.db = openDatabase(name, '1.0', '', 300 * 1024 * 1024) || window.openDatabase(name, '1.0', '', 300 * 1024 * 1024);
            }
            catch(ex)
            {

            }
            
        }
    };

    me.formDataBase = function()
    {
        this.db.transaction(function(req)
        {
            req.executeSql('CREATE TABLE IF NOT EXISTS DataSource (id INTEGER PRIMARY KEY AUTOINCREMENT,db_server,db_name,db_group, aggregation, level, db_items, labels, datalevels)', [],
                    function(res, rows) {
                    });
        },
                this.onError.bind(this),
                this.onReadyTransaction);
    };

    me.onReadyTransaction = function()
    {
        //console.log('Transaction completed.');
    };

    me.onError = function(err)
    {
        alert('Error in caching module: ' + err.message + '\n\n\n To solve this problem, try to clear your cache in browser.');
        this.openDataBase('DB');
    };

    me.onErrorSql = function(asd, err)
    {
        alert('Error in caching module: ' + err.message + '\n\n\n To solve this problem, try to clear your cache in browser.');
        this.openDataBase('DB');
    };

    me.onReadySql = function()
    {
        console.log('Executing SQL completed.');
    };

    me.onOpenSocket = function()
    {
        console.log('Socket opened.');
    };

    me.onErrorSocket = function(msg)
    {
        this.communicationType = 'httpgetbinary';
        console.log(msg);
    };

    me.onCloseSocket = function()
    {
        console.log('Socket closed.');
    };

    me.formURL = function(db_server, db_name, db_group, window, level)
    {
        var url = this.HostURL + '/services/getdata.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&db_mask=all'
                + '&experiment=' + window
                + '&window=0'
                + '&resample=' + level
                + '&format=csv';
        return url;
    };

    me.formURLList = function(db_server, db_name, db_group, target)
    {
        var url = this.HostURL + '/services/list.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&target=' + target;
        return url;
    };

    me.formURLLabel = function(db_server, db_name, db_group, db_mask, target)
    {
        var url = this.HostURL + '/services/list.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&db_mask=' + db_mask
                + '&target=' + target;
        return url;
    };

    me.formURLInfo = function(db_server, db_name, db_group, target)
    {
        var url = this.HostURL + '/services/info.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&target=' + target;
        return url;
    };

    me.formDataLevels = function(db_server, db_name, db_group)
    {
        var self = this;
        var url = self.formURLInfo(db_server, db_name, db_group, 'cache');
        var responseXML = self.httpGetXml(url);
        var item = responseXML.getElementsByTagName('Value');
        var dataLevels = item[0].getAttribute('resolutions').split(',');

        return dataLevels;
    };

    me.formDbMask = function(db_server, db_name, db_group)
    {
        var self = this;
        var url = self.formURLList(db_server, db_name, db_group, 'items');
        var responseXML = self.httpGetXml(url);
        var items = responseXML.getElementsByTagName('Value');
        var db_mask = [];
        for (var i = 0; i < items.length; i++)
        {
            db_mask.push(items[i].getAttribute('value'));
        }
        return db_mask;
    };

    me.formTableName = function(window)
    {
        var self = this;
        var tableName = 'cache' + window + '__' + self.dataHandl.getDbServer() + '__' + self.dataHandl.getDbName() + '__' + self.dataHandl.getDbGroup();
        return tableName;
    };

    me.formDataSourceStatement = function()
    {
        var self = this;
        var aggr = self.dataHandl.getAggregation();
        if (parseInt(self.level.window) === 0)
        {
            aggr = 'v';
        }
        var sqlStatement = 'SELECT * FROM DataSource WHERE ((db_server="' + self.dataHandl.getDbServer() + '") AND \n\
                                                                    (db_name="' + self.dataHandl.getDbName() + '")) AND \n\
                                                                    ((db_group="' + self.dataHandl.getDbGroup() + '") AND \n\
                                                                     (level="' + self.level.window + '")) AND \n\
                                                                    (aggregation="' + aggr + '") AND \n\
                                                                    (db_items="' + self.db_items + '")';
        return sqlStatement;
    };

    me.formTableColumns = function()
    {
        var self = this;
        var db_mask = self.dataHandl.getDbMask();
        var columns = '';
        for (var i = 0; i < db_mask.length; i++)
        {
            columns = columns + ', column' + db_mask[i];
        }
        return columns;
    };

    me.formLabels = function()
    {
        var self = this;
        var url = self.formURLLabel(self.dataHandl.getDbServer(), self.dataHandl.getDbName(), self.dataHandl.getDbGroup(), self.dataHandl.getDbMask(), 'items');
        var responseXML = self.httpGetXml(url);
        var items = responseXML.getElementsByTagName('Value');
        var labels = [];

        for (var i = 0; i < items.length; i++)
        {
            labels.push(items[i].getAttribute('name'));
        }
        return labels;
    };

    me.formValues = function(data, i)
    {
        var values = '';
        for (var j = 0; j < data.length; j++)
        {
            values = values + ',' + data[j][i];
        }
        return values;
    };

    me.httpGetXml = function(url)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseXML;
    };

    me.httpGetCsv = function(url, callback)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {

                callback(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };

    me.httpGetBinary = function(url, callback)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function()
        {
            callback(xmlHttp.response);
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.responseType = "arraybuffer";
        xmlHttp.send(null);
    };

    me.formURLGetCsv = function(db_server, db_name, db_group, db_mask, window, level)
    {
        var url = this.HostURL + '/services/getdata.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&db_mask=' + db_mask
                + '&experiment=' + window
                + '&window=0'
                + '&resample=' + level
                + '&format=csv';
        return url;
    };

    me.formURLGetBinary = function(db_server, db_name, db_group, db_mask, window, level)
    {
        var url = this.HostURL + '/services/getdata.php?db_server=' + db_server
                + '&db_name=' + db_name
                + '&db_group=' + db_group
                + '&db_mask=' + db_mask
                + '&experiment=' + window
                + '&window=0'
                + '&resample=' + level
                + '&format=binary';
        return url;
    };

    me.openDataBase('DB');
    me.formDataBase();

    if (me.communicationType === 'websockets')
    {
        me.webSocket = new webSockets('ws://ipecluster5.ipe.kit.edu:12345');
        me.webSocket.openSocket();
        me.webSocket.setOnOpenCallback(me.onOpenSocket);
        me.webSocket.setOnCloseCallback(me.onCloseSocket);
        me.webSocket.setOnErrorCallback(me.onErrorSocket.bind(me));
        me.webSocket.setOnMessageCallback(me.dataHandl.onMessageRecieved.bind(me.dataHandl));
    }

    me.dataHandl.setOnEndOfWorkCallback(me.onReadyFormingData.bind(me));

    return me;





};


