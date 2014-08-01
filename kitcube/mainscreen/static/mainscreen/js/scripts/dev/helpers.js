if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

var formAdeiUrl = function(host, server, dbname, dbgroup, masksToRequest, windowUrl, resample) {
    return host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=' + windowUrl + '&resample=' + resample;
}

var formAdeiUrlAxes = function(host, server, dbname, dbgroup) {
    return host + "services/list.php?target=axes&db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup;
}

var formAdeiUrlMeta = function(host, server, dbname, dbgroup, masksToRequest) {
    return host + "services/list.php?target=items&db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&info=1';

}

var formModelsUrlObj = function(models) {
    var masks = [];
    $.each(models, function(key, models) {
        var model = models.get('mask');

    });
}

var formModelsUrlArr = function(models) {

}

var getDataFromAdei = function(url, async, callback) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    //xmlHttp.setRequestHeader("Content-Type", "text/plain");
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    };

    xmlHttp.open("GET", url, async);
    xmlHttp.send(null);

    return this;
}

var parseTime = function(window) {
    var Microsec = window.substr(19);
    //window = window.substring(0, 18);
    var year = window.substr(7, 2);
    var month = window.substr(3, 3);
    var day = window.substr(0, 2);
    var hour = window.substr(10, 2);
    var minute = window.substr(13, 2);
    var sec = window.substr(16, 2);
    if (year > 60) {
        year = '19' + year;
    } else {
        year = '20' + year;
    }
    var d = new Date(year, monthFormats[month], day, hour, minute, sec);
    var buf = d.toISOString().substr(13).substring(0, 7);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    var Time = d.toISOString().substring(0, 13);
    Time = Time + buf + Microsec;
    return Time;
}

var getResample = function(numberOfPoints, start, end) {
    var seconds = start - end;
    return seconds / numberOfPoints;
}

var parseCSVForUpdating = function(msg, masklength) {
    var separator = ',';
    var lineSeparator = '\r\n';
    var rows = msg.split(lineSeparator);
    var channelCount = rows[0].split(separator);
    var dateTime = [];
    var data = [];

    for (var i = 1; i < rows.length - 1; i++) {
        var rowdata = rows[i].split(separator);
        var time = parseTime(rowdata[0]);
        time = (new Date(time)).getTime() / 1000;
        dateTime.push(time);
        for (var j = 0; j < masklength; j++) {
            data.push(parseFloat(rowdata[j + 1]));
        }
    }

    return {
        values: data,
        time: dateTime
    }
}

var monthFormats = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11
};

var parseCSV = function(msg, channelCount) {
    var separator = ',';
    var lineSeparator = '\r\n';
    var rows = msg.split(lineSeparator);
    //var channelCount = rows[0].split(separator);
    var dateTime = [];
    var data = [];

    for (var i = 0; i < channelCount; i++) {
        data.push([]);
    }

    for (var i = 1; i < rows.length - 1; i++) {
        var rowdata = rows[i].split(separator);
        var time = parseTime(rowdata[0]);
        time = (new Date(time)).getTime() / 1000;
        dateTime.push(time);
        for (var j = 0; j < rowdata.length - 1; j++) {
            data[j].push(parseFloat(rowdata[j + 1]));
        }
    }

    return {
        data: data,
        dateTime: dateTime
    }
}

function getSensorId(db_server, db_name, db_group, sensorId) {
    var testDownloader = new dataDownloader();
    var csvDataAboutSensor = testDownloader.getSensorData(db_server, db_name, db_group, sensorId);
    //console.log(csvDataAboutSensor);
    var matchedDataArr = csvDataAboutSensor.match(/.*\[(.*)\].*/);
    sensorId = matchedDataArr[1];
    return sensorId;
}

function requestToServ(url, callback, filetype, type) {
    //filetype = filetype ? filetype : 'json';
    type = type ? type : 'GET';
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var success = function(e) {
        var items = '';
        items = xhr.responseText;
        //console.log(items);
        /*switch(filetype) {
            case 'csv': {
                //items = CSV2JSON(xhr.responseText); 
                items = xhr.responseText;
                break;
            }
            case 'json': {
                items = JSON.parse(xhr.responseText); 
                break; 
            }
            default: items = xhr.responseText; break;
        } */
        callback(items);
    }
    var error = function(e) {
        console.log('Please enabled CORS using  access-control-allow-origin');
    }
    if (window.XDomainRequest && !sameOrigin(url)) {
        xhr = new XDomainRequest();
        xhr.onload = success;
    }
    if (filetype == 'image' && xhr.overrideMimeType) {
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
    xhr.onerror = error;
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success(e);
        }
    }
    try {
        if ('withCredentials' in xhr) {
            xhr.open(type, url, false);
        } else {
            xhr.open(type, url, false);
        }
        xhr.send(null);
    } catch (e) {
        error(e);
    }
}

// check if url is same domain

function sameOrigin(url) {
    var split = url.split('/');
    if (split[0] + '//' == window.location.protocol + '//') {
        return split[2] != window.location.host ? false : true;
    } else {
        return true;
    }
}


var BrowserDetect = {
    minVersion: undefined,
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },
    searchString: function (data) 
    {
        for (var i = 0; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                this.minVersion = data[i].min_ver;
                return data[i].identity;
            }
        }
    },
    isUpdateNeeded: function() {
        var browser = this.browser;
        var version = +this.version;
        var minVersion = +this.minVersion;
        if (browser === "Other" || version === "Unknown" || !version || !minVersion)
            return false;
        return minVersion >= version;
    },
    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome", min_ver: "10"},
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer", min_ver: "10"},
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox", min_ver: "10"},
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari", min_ver: "5"},
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera", min_ver: "12"}
    ]

};