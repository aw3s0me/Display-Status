if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

var getResample = function(numberOfPoints, start, end) {
    var seconds = start - end;
    return seconds / numberOfPoints;
};

var parseCSVForUpdating = function(msg, masklength) {
    var separator = ',';
    var lineSeparator = '\r\n';
    var rows = msg.split(lineSeparator);
    var channelCount = rows[0].split(separator);
    var dateTime = [];
    var data = [];

    for (var i = 1; i < rows.length - 1; i++) {
        var rowdata = rows[i].split(separator);
        var time = window.db.dateHelper.splitTimeFromAny(rowdata[0]); //jest
        time = (new Date(time)).getTime() / 1000;
        dateTime.push(time);
        //for (var j = 0; j < rowdata.length - 1; j++)
        for (var j = 0; j < masklength; j++) {
            data.push(parseFloat(rowdata[j + 1]));
        }
    }

    return {
        values: data,
        time: dateTime
    }
}

var parseCSV = function(msg) {
    var separator = ',';
    var lineSeparator = '\r\n';
    var rows = msg.split(lineSeparator);
    var channelCount = rows[0].split(separator);
    var dateTime = [];
    var data = [];

    for (var i = 0; i < channelCount.length; i++) {
        data.push([]);
    }

    for (var i = 1; i < rows.length - 1; i++) {
        var rowdata = rows[i].split(separator);
        var time = window.db.dateHelper.splitTimeFromAny(rowdata[0]); //jest
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
        console.log(items);
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


function getSensorNumber(db_server, db_name, db_group, sensorId) {
    var url = 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + db_server + '&db_name=' + db_name + '&db_group=' + db_group + '&db_mask=' + sensorId + '&window=-1&format=csv';
    console.log(url);
    var data;
    requestToServ(url, function(e) {
        data = e;
    }, '');
    //console.log(data);
    var sensorNumber = (data.match(/.*\n{1}.*\,{1}\s{0,1}(.*)/))[1];
    //console.log(sensorNumber);
    return sensorNumber;
}