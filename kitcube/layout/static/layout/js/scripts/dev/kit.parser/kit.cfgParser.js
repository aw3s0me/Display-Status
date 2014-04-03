//(function($) {

function cfgParser(cfgFile) {
    if ((typeof cfgFile != 'string' || !(cfgFile instanceof String)) && !cfgFile && !gridElem) {
        console.log('cfgFile is not a string or empty' + cfgFile);
        throw 'cfgFile is not a string or empty' + cfgFile;
        return;
    }
    this.cfgFile = cfgFile;
    this.prsObj = undefined;
};

cfgParser.prototype.initCfgFile = function(cfgFileName) {
    if ((typeof cfgFileName != 'string' || !(cfgFileName instanceof String)) && !cfgFileName) {
        console.log('cfgFile is not a string or empty' + cfgFileName);
        throw 'cfgFile is not a string or empty' + cfgFileName;
        return;
    }
    this.cfgFile = cfgFileName;
}

/*
This functions parses .ini file and return json object
*/

cfgParser.prototype.parseIni = function() {

    if (!this.cfgFile) {
        console.log('Need to initialize cfgFile, use initCfgFile');
        throw 'Need to initialize cfgFile, use initCfgFile';
        return;
    }
    var self = this;
    var elements = {};

    $.ajax({
        url: this.cfgFile,
        async: false,
        success: function(data) {
            var jsonObj = {};
            var lines = data.split(/\r\n|\r|\n/);
            var section = null;

            var regex = {
                section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
                param: /^\s*([\w\.\-\_]+)\s*:\s*(.*?)\s*$/,
                comment: /^\s*;.*$/,
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

            self.prsObj = jsonObj;
        }


    });
    return self.prsObj;
};

/* Method that parse json cfg file */

cfgParser.prototype.parseJson = function(text) {
    if (!this.cfgFile) {
        console.log('Need to initialize cfgFile, use initCfgFile');
        throw 'Need to initialize cfgFile, use initCfgFile';
        return;
    }
    //console.log(text);
    var jsonObj = JSON.parse(text);
    this.prsObj = jsonObj;
    /*var self = this;
    var filePath = this.cfgFile;
    $.ajax({
        url: filePath,
        async: false,
        dataType: 'text',
        success: function(data) {
            //console.log(data);
            var jsonObj = JSON.parse(data);
            //console.log(jsonObj);
            self.prsObj = jsonObj;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        },
    }); 
    return self.prsObj;*/
    return this.prsObj;
};

cfgParser.prototype.parseCSV = function(csv) {
    //console.log(csv);
    var array = CSVToArray(csv);
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
}


cfgParser.prototype.parseText = function(text) {
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
    return self.prsObj;
}

cfgParser.prototype.parseYAML = function(text) {
    var YAML = require('yaml');
    this.prsObj = YAML.load(text);
    //console.log(this.prsObj);
    return this.prsObj;
}



// return cfgParser;

//})(jQuery);
