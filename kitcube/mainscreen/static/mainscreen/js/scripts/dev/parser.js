define([], function () {
    function CfgParser() {
        this._cfg = undefined;
        this._parsed = undefined;
        this.parseCfg = function(type, file) {

        }
    }

    function DataParser() {
        this._file = undefined;
        this._parser = undefined;
        this.parseData = function(type, file) {

        }
    }

    function ProxyParser() {
        var cfgparser = new CfgParser();
        var dataparser = new DataParser();
        this.isFileValid = function (file) {
            return !((typeof file != 'string' || !(file instanceof String)) && !file);
        };
        this.getLastCfg = function() {
            return cfgparser._cfg;
        };
        this.getLastParsedCfg = function () {
            return cfgparser._parsed;
        };
        this.parseCfg = function(type, file, callback) {
            if (!this.isFileValid(file)) {
                throw 'cfgFile is not a string or empty' + file;
            }

            try {
                switch(type) {
                    case 'csv':
                        cfgparser.parseCfgCSV(file);
                        break;
                    case 'json':
                        cfgparser.parseJson(file);
                        break;
                    case 'yaml':
                        cfgparser.parseYAML(file);
                        break;
                    case 'ini':
                        cfgparser.parseIni(file);
                        break;
                    default:
                        cfgparser.parseCfgCSV(file);
                        break;
                }
                if (callback)
                    callback();
            }
            catch(err) {
                throw 'Error ocured while parsing cfg file';
            }
        };

        this.parseData = function(type, file, count, callback) {
            if (!this.isFileValid(file)) {
                throw 'data file is not a string or empty' + file;
            }

            if (!count)
                throw 'channel count is undefined';

            try {
                switch(type) {
                    case 'csv':
                        dataparse.parseCSV(file, count);
                        break;
                    case 'json':
                        throw 'no json parser';
                        break;
                    case 'yaml':
                        throw 'no yaml parser';
                        break;
                    case 'ini':
                        throw 'no ini parser';
                        break;
                    default:
                        throw 'no default parser';
                        break;
                }
                if (callback)
                    callback();
            }
            catch(err) {
                throw 'Error ocured while parsing data file';
            }
        }
    }

    CfgParser.prototype.CSVToArray = function(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    /*
    This functions parses .ini file and return json object
    */

    CfgParser.prototype.parseIni = function(file) {
        var self = this;
        var elements = {};

        $.ajax({
            url: file,
            async: false,
            success: function(data) {
                var jsonObj = {};
                var lines = data.split(/\r\n|\r|\n/);
                var section = null;

                var regex = {
                    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
                    param: /^\s*([\w\.\-\_]+)\s*:\s*(.*?)\s*$/,
                    comment: /^\s*;.*$/
                };
                //split all file into lines by \n
                lines.forEach(function(line) {
                    if (regex.comment.test(line)) { //than test it for user comments
                        return;
                    } else if (regex.param.test(line)) { //if this is parameter
                        var match = line.match(regex.param); //match for parameter
                        if (section) { //if section initialized
                            jsonObj[section][match[1]] = match[2];
                        } else {
                            jsonObj[match[1]] = match[2]; //bind param to section elem
                        }
                    } else if (regex.section.test(line)) { //test for section like []
                        var match = line.match(regex.section);
                        jsonObj[match[1]] = {};
                        section = match[1];
                    } else if (line.length == 0 && section) {
                        section = null;
                    };
                });
                var output = '';
                for (var property in jsonObj) {
                    output += property + ': ' + jsonObj[property] + '; ';
                }

                /* Group parse */
                for (var objName in jsonObj) {
                    var groupArr = objName.split('/');
                    if (groupArr.length > 1 && groupArr.lenght < 3) { //this is group elem
                        jsonObj[groupArr[0]].elements = [];
                        jsonObj[groupArr[0]].elements.push(jsonObj[groupArr[i]]);
                    }

                    //console.log(groupArr);
                }
                /* Group parse ends */

                self._parsed = jsonObj;
            }


        });
        return self._parsed;
    };

    /* Method that parse json cfg file */

    CfgParser.prototype.parseJson = function(text) {
        var jsonObj = JSON.parse(text);
        return (this.prsObj = jsonObj);
    };

    DataParser.prototype.parseCSVForUpdating = function(msg, masklength) {
        var separator = ',';
        var lineSeparator = '\r\n';
        var rows = msg.split(lineSeparator);
        var channelCount = rows[0].split(separator);
        var dateTime = [];
        var data = [];

        for (var i = 1; i < rows.length - 1; i++) {
            var rowdata = rows[i].split(separator);
            var time = this.parseTime(rowdata[0]);
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
    };

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

    DataParser.prototype.parseCSV = function(msg, channelCount) {
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
            var time = this.parseTime(rowdata[0]);
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
    };

    DataParser.prototype.parseTime = function (window) {
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
    };

    CfgParser.prototype.parseCfgCSV = function(csv) {
        //console.log(csv);
        var array = this.CSVToArray(csv);
        //console.log(array);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k];
            }
        }
        var json = JSON.stringify(objArray);
        var str = json.replace(/},/g, "},\r\n");
        var jsonObj = JSON.parse(str);

        return jsonObj;
    };


    CfgParser.prototype.parseText = function(text) {
        //console.log(text);
        var self = this;
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok
            var jsonObj = JSON.parse(text);
            //console.log(jsonObj);
                //console.log(jsonObj);
            self.prsObj = jsonObj;
        }
        else {
            //the json is not ok
            console.log('Editor text is not json');
            return undefined;
        }
        return self.parsed;
    };

    CfgParser.prototype.parseYAML = function(text) {
        var YAML = require('yaml');
        this.prsObj = YAML.load(text);
        return this.prsObj;
    };
    return new ProxyParser;
});

// return Parser;

//})(jQuery);
