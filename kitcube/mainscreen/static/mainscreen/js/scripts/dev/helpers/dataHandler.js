var dataHandler = function(communicationType)
{
    var me = {};

    me.dateHelper = new dateTimeFormat();

    me.db_server = '';
    me.db_name = '';
    me.db_group = '';
    me.db_mask = '';
    me.window = '';
    me.aggregation = '';
    me.communicationType = communicationType;

    me.lineSeparator = '\r\n';
    me.separator = ',';

    me.beginTime = '';
    me.endTime = '';
    me.pointCount = '';
    me.level = '';

    me.labels = '';

    me.isOnePortion = true;

    me.backCachers = [];

    me.onEndOfWork = '';

    me.dataLevel = [];

    me.startBackgroundCaching = function(level, tableColumns, tableName)
    {
        if (level.window >= 0)
        {
            var db_items = this.formDbMask();
            var labels = this.formLabels();
            var datalevels = this.formDataLevels();
            var aggregation = this.aggregation;
            if (level.window == 0)
            {
                aggregation = 'v';
            }        
            var worker = new Worker('/static/mainscreen/js/scripts/dev/datacaching/backgrDataCacher.js');  
            this.backCachers.push(worker);           
            worker.postMessage(this.db_server + '<>'
                    + this.db_name + '<>'
                    + this.db_group + '<>'
                    + this.window + '<>'
                    + level.window + '<>'
                    + tableColumns + '<>'
                    + tableName + '<>'
                    + db_items + '<>'
                    + labels + '<>'
                    + datalevels + '<>'
                    + aggregation + '<>'
                    + this.communicationType);
        }
    };

    me.formDbMask = function()
    {
        var db_items = this.db_mask[0];
        for (var i = 1; i < this.db_mask.length; i++)
        {
            db_items = db_items + ',' + this.db_mask[i];
        }
        return db_items;
    };

    me.formLabels = function()
    {
        var labels = this.labels[0];
        for (var i = 1; i < this.labels.length; i++)
        {
            labels = labels + ',' + this.labels[i];
        }
        return labels;
    };

    me.formDataLevels = function()
    {
        var datalevels = this.dataLevel[0].window;
        for (var i = 1; i < this.dataLevel.length; i++)
        {
            datalevels = datalevels + ',' + this.dataLevel[i].window;
        }
        return datalevels;
    };

    me.setNewRequest = function(db_server, db_name, db_group, db_mask, window, pointCount)
    {
        this.db_server = db_server;
        this.db_name = db_name;
        this.db_group = db_group;
        this.db_mask = db_mask;
        this.window = window;
        this.beginTime = this.window.split('-')[0];
        this.endTime = this.window.split('-')[1];
        this.pointCount = pointCount;

        this.level = this.getDataLevel(this.pointCount, this.window);
    };

    me.setRequest = function(window, pointCount)
    {
        this.window = window;
        this.beginTime = this.window.split('-')[0];
        this.endTime = this.window.split('-')[1];
        this.pointCount = pointCount;

        this.level = this.getDataLevel(this.pointCount, this.window);
    };

    me.isPriviousRequest = function(db_server, db_name, db_group, aggregation, db_mask)
    {
        if (this.db_server == db_server && this.db_name == db_name && this.db_group == db_group && this.aggregation == aggregation)
        {
            var count = 0;
            for (var i = 0; i < this.db_mask.length; i++)
            {
                if (this.db_mask[i] == db_mask[i])
                {
                    count++;
                }
            }
            if (count == this.db_mask.length)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    };

    me.setDataLevels = function(dataLevel)
    {
        this.dataLevel = [];
        for (var i = 0; i < dataLevel.length; i++)
        {
            var level = {};
            level.window = dataLevel[i];
            this.dataLevel.push(level);
        }
    };

    me.concatRowData = function(res, dataBuffer, dateTime)
    {
        var properties = Object.keys(res.rows.item(0))
        for (var j = 0; j < properties.length - 1; j++)
        {
            dataBuffer.push([]);
        }
        for (var k = 0; k < res.rows.length; k++)
        {

            for (var i = 0; i < properties.length; i++)
            {
                if (properties[i] == 'DateTime')
                {
                    dateTime.push(res.rows.item(k).DateTime);
                }
                else
                {
                    var data = res.rows.item(k)[properties[i]];
                    dataBuffer[i - 1].push(data);
                }
            }
        }
    };

    me.getDataLevel = function(pointCount, window)
    {
        var diffrence = window.split('-')[1] - window.split('-')[0];
        var multiplier = diffrence / pointCount;
        var level;

        for (var i = 0; i < this.dataLevel.length; i++)
        {
            if (this.dataLevel[i].window > multiplier)
            {
                continue;
            }
            level = this.dataLevel[i];
            break;
        }
        return level;
    };

    me.getDataLevelForBackgr = function(level)
    {
        for (var i = 0; i < this.dataLevel.length; i++)
        {
            if (this.dataLevel[i] == level)
            {
                if (i == this.dataLevel.length - 1)
                {
                    return level;
                }
                else
                {
                    return this.dataLevel[i + 1];
                }
            }
        }
    };

    me.getDbServer = function()
    {
        return this.db_server;
    };

    me.getDbName = function()
    {
        return this.db_name;
    };

    me.getDbGroup = function()
    {
        return this.db_group;
    };

    me.getDbMask = function()
    {
        return this.db_mask;
    };

    me.getBeginTime = function()
    {
        return this.beginTime;
    };

    me.setBeginTime = function(beginTime)
    {
        this.beginTime = beginTime;
    };

    me.getEndTime = function()
    {
        return this.endTime;
    };

    me.setEndTime = function(endTime)
    {
        this.endTime = endTime;
    };

    me.getWindow = function()
    {
        return this.window;
    };

    me.setWindow = function(window)
    {
        this.window = window;
    };

    me.getLabels = function()
    {
        return this.labels;
    };

    me.getDataLevelForUp = function(level)
    {
        for (var i = 0; i < this.dataLevel.length; i++)
        {
            if (this.dataLevel[i] == level)
            {
                if (i == 0)
                {
                    return level;
                }
                else
                {
                    return this.dataLevel[i - 1];
                }
            }
        }
    };

    me.setLabels = function(labels)
    {
        this.labels = labels;
    };

    me.setOnEndOfWorkCallback = function(callback)
    {
        this.onEndOfWork = callback;
    };

    me.setReadingMode = function(readingMode)
    {
        this.isOnePortion = readingMode;
    };

    me.setAggregation = function(aggregation)
    {
        this.aggregation = aggregation;
    };

    me.getAggregation = function()
    {
        return this.aggregation;
    };

    me.deleteWorkers = function()
    {
        if (this.backCachers.length !== 0)
        {
            for (var i = 0; i < this.backCachers.length; i++)
            {
                this.backCachers[i].terminate();
            }
            this.backCachers = [];
        }
    };

    me.formatBeginUnixTime = function()
    {
        var multiplier = this.beginTime / this.level.window;
        multiplier = parseInt(multiplier);
        multiplier = multiplier * this.level.window;
        return multiplier;
    };

    me.formatEndUnixTime = function()
    {
        var multiplier = this.endTime / this.level.window;
        multiplier = parseInt(multiplier);
        multiplier = multiplier * this.level.window;
        return multiplier;
    };

    me.onMessageRecieved = function(msg)
    {
        if (this.isOnePortion)
        {
            var dataStream = new DataStream(msg.data);
            dataStream.endianness = dataStream.BIG_ENDIAN;
            var dateTime = [];
            var data = [];
            for (var i = 0; i < this.db_mask.length; i++)
            {
                data.push([]);
            }
            try
            {
                while (!dataStream.isEof())
                {
                    var time = dataStream.readString(29);
                    dateTime.push(this.formatToUnix(time));
                    for (var i = 0; i < this.db_mask.length; i++)
                    {
                        data[i].push(dataStream.readFloat64(true));
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                console.log(String.fromCharCode.apply(null, new Uint16Array(msg.data)));
            }
        }

        this.onEndOfWork({data: data, dateTime: dateTime, label: this.labels});
    }
    ;

    me.onMessageRecievedCsv = function(msg)
    {
        var self = this;
        var rows = msg.split(self.lineSeparator);
        var channelCount = rows[0].split(self.separator);
        var dateTime = [];
        var data = [];

        for (var i = 0; i < channelCount.length; i++) 
        {
            data.push([]);
        }

        for (var i = 1; i < rows.length - 1; i++)
        {
            var rowdata = rows[i].split(self.separator);
            var time = self.dateHelper.splitTimeFromAny(rowdata[0]);
            time = (new Date(time)).getTime()/1000;
            dateTime.push(time);
            for (var j = 0; j < rowdata.length - 1; j++)
            {
                data[j].push(parseFloat(rowdata[j + 1]));
            }
        }

        this.onEndOfWork({data: data, dateTime: dateTime, label: this.labels});
    };

    me.onMessageRecievedBinary = function(msg)
    {
        var dataStream = new DataStream(msg);
        dataStream.readString(1);
        dataStream.endianness = dataStream.BIG_ENDIAN;
        var dateTime = [];
        var data = [];
        for (var i = 0; i < this.db_mask.length; i++)
        {
            data.push([]);
        }
        try
        {
            while (!dataStream.isEof())
            {
                var time = dataStream.readString(26);
                dateTime.push(this.formatToUnix(time));
                for (var i = 0; i < this.db_mask.length; i++)
                {
                    data[i].push(dataStream.readFloat64(true));
                }
            }
        }
        catch (err)
        {
            console.log(err);
            console.log(String.fromCharCode.apply(null, new Uint16Array(msg.data)));
        }
        this.onEndOfWork({data: data, dateTime: dateTime, label: this.labels});
    };

    me.formatToUnix = function(time)
    {
        var date = time.split('.')[0];
        var milisec = time.split('.')[1];
        var unix = ((new Date(date.replace(' ', 'T')).getTime()) / 1000) + '.' + milisec;
        return unix;
    };



    return me;

};




